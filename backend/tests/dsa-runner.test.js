const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const express = require("express");
const Dsa = require("../models/Dsa");
const { pool } = require("../config/db");
const dsaRoutes = require("../routes/dsaRoutes");
const ApiError = require("../utils/ApiError");
const { createDsaService, validateSubmission } = require("../services/dsaService");
const { createJudge0Runner, normalizeOutput } = require("../services/judge0Service");

const problemId = "16fd2706-8baf-433b-82eb-8c7fada847da";
const testProblem = {
  id: problemId,
  test_cases: [
    { input: "2\n", expected_output: "2\n" },
    { input: "4\n", expected_output: "4\n" },
  ],
  time_limit_ms: 500,
  memory_limit_kb: 32768,
};

const fakeModel = (overrides = {}) => ({
  listProblems: async () => [testProblem],
  findProblemById: async () => testProblem,
  createSubmission: async (record) => ({ id: "submission-1", created_at: "2026-10-22T00:00:00Z", ...record }),
  finishSubmission: async () => {},
  ...overrides,
});

const tests = [];
const test = (name, fn) => tests.push({ name, fn });

test("Submission insert binds finished_at as its own nullable timestamp parameter", async () => {
  const originalQuery = pool.query;
  const calls = [];
  pool.query = async (sql, values) => {
    calls.push({ sql, values });
    return { rows: [{ id: `submission-${calls.length}`, created_at: new Date("2026-10-22T00:00:00Z") }] };
  };

  try {
    await Dsa.createSubmission({ userId: "user-1", problemId, language: "javascript", code: "console.log(1)", status: "running" });
    await Dsa.createSubmission({ userId: "user-1", problemId, language: "javascript", code: "console.log(1)", status: "execution_disabled" });

    for (const { sql } of calls) {
      assert.match(sql, /VALUES\s*\(\$1,\s*\$2,\s*\$3,\s*\$4,\s*\$5,\s*\$6\)/);
      assert.doesNotMatch(sql, /CASE\s+WHEN\s+\$5\s*=/i);
    }

    assert.equal(calls[0].values[4], "running");
    assert.equal(calls[0].values[5], null);
    assert.equal(calls[1].values[4], "execution_disabled");
    assert.ok(calls[1].values[5] instanceof Date);
    assert.equal(Number.isNaN(calls[1].values[5].getTime()), false);
  } finally {
    pool.query = originalQuery;
  }
});

test("DSA input validation rejects invalid UUID, language, empty and oversized code", () => {
  assert.throws(() => validateSubmission({ problemId: "bad", language: "javascript", code: "x" }), { code: "INVALID_PROBLEM_ID" });
  assert.throws(() => validateSubmission({ problemId, language: "ruby", code: "x" }), { code: "UNSUPPORTED_LANGUAGE" });
  assert.throws(() => validateSubmission({ problemId, language: "python", code: " " }), { code: "CODE_REQUIRED" });
  assert.throws(() => validateSubmission({ problemId, language: "python", code: "x".repeat(50 * 1024 + 1) }), { code: "CODE_TOO_LARGE" });
});

test("Execution-off mode saves blocked submission and never calls runner", async () => {
  let savedStatus;
  let runnerCalled = false;
  const service = createDsaService({
    model: fakeModel({ createSubmission: async ({ status }) => { savedStatus = status; return { id: "saved-1" }; } }),
    runner: async () => { runnerCalled = true; },
    config: { DSA_EXECUTION_ENABLED: false, DSA_SECURITY_REVIEW_APPROVED: false },
  });
  await assert.rejects(service.submit({ userId: "user-1", problemId, language: "javascript", code: "console.log(2)" }), (error) => error instanceof ApiError && error.statusCode === 503 && error.code === "DSA_EXECUTION_DISABLED" && error.details.submissionId === "saved-1");
  assert.equal(savedStatus, "execution_disabled");
  assert.equal(runnerCalled, false);
});

test("Execution cannot run before the separate security review approval", async () => {
  let runnerCalled = false;
  const service = createDsaService({ model: fakeModel(), runner: async () => { runnerCalled = true; }, config: { DSA_EXECUTION_ENABLED: true, DSA_SECURITY_REVIEW_APPROVED: false } });
  await assert.rejects(service.submit({ userId: "u", problemId, language: "python", code: "print(1)" }), { code: "DSA_SECURITY_REVIEW_REQUIRED" });
  assert.equal(runnerCalled, false);
});

test("Enabled runner fails clearly when Judge0 URL or key is missing", async () => {
  const runner = createJudge0Runner({ config: { JUDGE0_API_URL: "", JUDGE0_API_KEY: "" } });
  await assert.rejects(runner({ code: "", language: "python", problem: testProblem }), { code: "JUDGE0_CONFIGURATION_MISSING" });
});

test("Approved execution config with missing Judge0 credentials saves a runner error, never success", async () => {
  let finishRecord;
  const service = createDsaService({
    model: fakeModel({ finishSubmission: async (record) => { finishRecord = record; } }),
    config: { DSA_EXECUTION_ENABLED: true, DSA_SECURITY_REVIEW_APPROVED: true, JUDGE0_API_URL: "", JUDGE0_API_KEY: "" },
  });
  await assert.rejects(service.submit({ userId: "u", problemId, language: "javascript", code: "console.log(1)" }), { code: "JUDGE0_CONFIGURATION_MISSING" });
  assert.equal(finishRecord.verdict, "runner_error");
  assert.deepEqual(finishRecord.results, []);
});

test("Judge0 adapter applies resource limits and returns each real stubbed test verdict", async () => {
  const calls = [];
  const fakeFetch = async (url, options = {}) => {
    options = { ...options, method: options.method || "GET" };
    calls.push({ url, options });
    if (options.method === "POST") return { ok: true, json: async () => ({ token: `token-${calls.filter((c) => c.options.method === "POST").length}` }) };
    const caseIndex = calls.filter((c) => c.options.method === "GET").length;
    const stdout = caseIndex === 1 ? "2\n" : "WRONG\n";
    return { ok: true, json: async () => ({ status: { id: 3, description: "Accepted" }, stdout: Buffer.from(stdout).toString("base64"), time: "0.012", memory: 2048 }) };
  };
  const runner = createJudge0Runner({ fetchImpl: fakeFetch, config: { JUDGE0_API_URL: "https://judge.example/api", JUDGE0_API_KEY: "test-key" }, wait: async () => {} });
  const result = await runner({ code: "console.log(2)", language: "javascript", problem: testProblem });
  assert.equal(result.verdict, "wrong_answer");
  assert.deepEqual(result.results.map((item) => item.passed), [true, false]);
  const submittedPayload = JSON.parse(calls[0].options.body);
  assert.equal(submittedPayload.cpu_time_limit, 0.5);
  assert.equal(submittedPayload.memory_limit, 32768);
  assert.equal(submittedPayload.language_id, 63);
  assert.equal(calls.filter((call) => call.options.method === "POST").length, 2);
  assert.equal(normalizeOutput("x\r\n"), "x");
});

test("Submission service persists actual result and maps DB result into response", async () => {
  let finished;
  const service = createDsaService({
    model: fakeModel({ finishSubmission: async (record) => { finished = record; } }),
    runner: async () => ({ verdict: "accepted", results: [{ case: 1, passed: true }], passed: 2, total: 2, executionMs: 10, memoryKb: 1024 }),
    config: { DSA_EXECUTION_ENABLED: true, DSA_SECURITY_REVIEW_APPROVED: true },
  });
  const response = await service.submit({ userId: "user-1", problemId, language: "javascript", code: "console.log(2)" });
  assert.equal(response.verdict, "accepted");
  assert.equal(response.submissionId, "submission-1");
  assert.equal(finished.submissionId, "submission-1");
  assert.equal(finished.executionMs, 10);
});

test("GET /api/dsa/problems returns the database catalogue through the Express route", async () => {
  const originalListProblems = Dsa.listProblems;
  Dsa.listProblems = async () => [{ id: problemId, slug: "two-sum", title: "Two Sum", difficulty: "Easy", topics: ["Arrays"] }];
  const app = express();
  app.use("/api/dsa", dsaRoutes);
  app.use((error, _req, res, _next) => res.status(error.statusCode || 500).json({ success: false, message: error.message }));
  const server = await new Promise((resolve, reject) => {
    const listener = app.listen(0, "127.0.0.1", () => resolve(listener));
    listener.once("error", reject);
  });
  try {
    const response = await fetch(`http://127.0.0.1:${server.address().port}/api/dsa/problems`);
    assert.equal(response.status, 200);
    const payload = await response.json();
    assert.equal(payload.data[0].slug, "two-sum");
    console.log(`HTTP ${response.status} GET /api/dsa/problems -> ${JSON.stringify(payload)}`);
  } finally {
    Dsa.listProblems = originalListProblems;
    await new Promise((resolve) => server.close(resolve));
  }
});

test("Additive SQL migration has valid JSONB catalogue payloads and seed rows", () => {
  const sql = fs.readFileSync(path.join(__dirname, "../migrations/001_dsa_runner.sql"), "utf8");
  const expression = new RegExp(String.raw`\$json\$([\s\S]*?)\$json\$::jsonb`, "g");
  const jsonValues = [...sql.matchAll(expression)].map((match) => JSON.parse(match[1]));
  assert.equal(jsonValues.length, 15);
  assert.match(sql, /ON CONFLICT \(slug\) DO NOTHING/);
  assert.match(sql, /ALTER TABLE coding_submissions|ALTER TABLE coding_test_results/);
});

(async () => {
  let failed = 0;
  for (const item of tests) {
    try {
      await item.fn();
      console.log(`[PASS] ${item.name}`);
    } catch (error) {
      failed += 1;
      console.error(`[FAIL] ${item.name}: ${error.stack || error.message}`);
    }
  }
  console.log(`DSA runner tests: ${tests.length - failed} passed, ${failed} failed`);
  if (failed) process.exitCode = 1;
})();
