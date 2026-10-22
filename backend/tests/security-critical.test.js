const assert = require("node:assert/strict");
const express = require("express");
const Interview = require("../models/Interview");
const InterviewQuestion = require("../models/InterviewQuestion");
const InterviewAnswer = require("../models/InterviewAnswer");
const { env, validateEnv } = require("../config/env");
const { createSubmitCodeHandler } = require("../controllers/dsaController");
const { submitAnswerHandler } = require("../controllers/interviewController");
const { getPrintableHtmlHandler } = require("../controllers/reportController");
const { errorHandler } = require("../middleware/errorMiddleware");

const tests = [];
const test = (name, fn) => tests.push({ name, fn });

const invoke = async ({ handler, method = "post", path = "/", body = {}, user, onError = errorHandler }) => {
  const app = express();
  app.use(express.json());
  app[method](path, (req, _res, next) => {
    req.user = user;
    req.params = { id: "owned-interview" };
    req.id = "security-test-request";
    next();
  }, handler);
  app.use(onError);
  const server = await new Promise((resolve, reject) => {
    const listener = app.listen(0, "127.0.0.1", () => resolve(listener));
    listener.once("error", reject);
  });
  try {
    return await fetch(`http://127.0.0.1:${server.address().port}${path}`, {
      method: method.toUpperCase(),
      headers: { "content-type": "application/json" },
      body: method === "get" ? undefined : JSON.stringify(body),
    });
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
};

test("DSA production handler rejects identity fields and takes userId only from auth context", async () => {
  let submitted;
  let calls = 0;
  const handler = createSubmitCodeHandler(async (input) => {
    calls += 1;
    submitted = input;
    return { submissionId: "stubbed-submission" };
  });

  const rejected = await invoke({
    handler,
    body: { problemId: "problem-1", language: "javascript", code: "x", userId: "account-A" },
    user: { id: "account-B" },
  });
  assert.equal(rejected.status, 400);
  assert.equal(calls, 0);

  const accepted = await invoke({
    handler,
    body: { problemId: "problem-1", language: "javascript", code: "x" },
    user: { id: "account-B" },
  });
  assert.equal(accepted.status, 200);
  assert.deepEqual(submitted, { problemId: "problem-1", language: "javascript", code: "x", userId: "account-B" });
});

test("Interview answer handler returns 404 when owned interview has no in-interview question; never falls back to questionId", async () => {
  const originalFindInterview = Interview.findByIdAndUser;
  const originalFindQuestion = InterviewQuestion.findByInterviewAndPosition;
  const originalCreateAnswer = InterviewAnswer.createOrUpdate;
  let questionLookup;
  let answerCreated = false;
  Interview.findByIdAndUser = async (id, userId) => ({ id, user_id: userId, status: "in_progress", difficulty: "intermediate", target_role: "Engineer" });
  InterviewQuestion.findByInterviewAndPosition = async (interviewId, position) => {
    questionLookup = { interviewId, position };
    return null;
  };
  InterviewAnswer.createOrUpdate = async () => { answerCreated = true; };
  try {
    const response = await invoke({
      handler: submitAnswerHandler,
      body: { questionId: "question-owned-by-account-A", answerText: "answer", position: 1 },
      user: { id: "account-B" },
    });
    assert.equal(response.status, 404);
    assert.equal(questionLookup.interviewId, "owned-interview");
    assert.equal(questionLookup.position, 1);
    assert.equal(answerCreated, false);
  } finally {
    Interview.findByIdAndUser = originalFindInterview;
    InterviewQuestion.findByInterviewAndPosition = originalFindQuestion;
    InterviewAnswer.createOrUpdate = originalCreateAnswer;
  }
});

test("Printable report handler escapes all user and interview content before returning HTML", async () => {
  const originalGetDetails = Interview.getFullSessionDetails;
  Interview.getFullSessionDetails = async () => ({
    interview: { target_role: "<img src=x onerror=alert(1)>", difficulty: "<b>senior</b>", interview_type: "technical", status: "completed", question_limit: 1 },
    items: [{
      position: 1,
      category: "<svg onload=alert(2)>",
      question_text: "<script>question</script>",
      answer_text: "<script>answer</script>",
      scores: { overall: 90 },
      strengths: ["<script>strength</script>"],
      improvements: ["<script>improvement</script>"],
      ideal_answer: "<script>ideal</script>",
    }],
  });
  const app = express();
  app.get("/report", (req, _res, next) => {
    req.user = { id: "account-B", name: "<script>candidate</script>", email: "<img src=x>" };
    req.params = { id: "owned-interview" };
    next();
  }, getPrintableHtmlHandler);
  app.use((error, _req, res, _next) => res.status(error.statusCode || 500).json({ message: error.message }));
  const server = await new Promise((resolve, reject) => {
    const listener = app.listen(0, "127.0.0.1", () => resolve(listener));
    listener.once("error", reject);
  });
  try {
    const response = await fetch(`http://127.0.0.1:${server.address().port}/report`);
    const html = await response.text();
    assert.equal(response.status, 200);
    for (const raw of ["<script>", "<img", "<svg"]) assert.equal(html.includes(raw), false, `${raw} must not be emitted`);
    for (const escaped of ["&lt;script&gt;", "&lt;img", "&lt;svg"]) assert.equal(html.includes(escaped), true, `${escaped} should be present`);
  } finally {
    Interview.getFullSessionDetails = originalGetDetails;
    await new Promise((resolve) => server.close(resolve));
  }
});

test("Production error middleware returns generic 500 and logs redacted server details", async () => {
  const priorMode = env.NODE_ENV;
  const originalLog = console.error;
  const logged = [];
  env.NODE_ENV = "production";
  console.error = (...args) => logged.push(args.join(" "));
  try {
    const response = await invoke({
      handler: (_req, _res, next) => next(new Error("database failed with password=hunter2 Bearer abc.def.ghi")),
      user: { id: "account-B" },
    });
    const payload = await response.json();
    assert.equal(response.status, 500);
    assert.equal(payload.message, "Internal server error.");
    assert.equal(payload.error.code, "INTERNAL_SERVER_ERROR");
    assert.equal(payload.error.message, "Internal server error.");
    assert.equal(JSON.stringify(payload).includes("hunter2"), false);
    assert.equal(JSON.stringify(payload).includes("abc.def.ghi"), false);
    assert.match(logged.join(" "), /database failed/);
    assert.equal(logged.join(" ").includes("hunter2"), false);
    assert.equal(logged.join(" ").includes("abc.def.ghi"), false);
  } finally {
    env.NODE_ENV = priorMode;
    console.error = originalLog;
  }
});

test("Production startup validation fails without explicit secure client origins", () => {
  const priorMode = process.env.NODE_ENV;
  const priorClientUrls = process.env.CLIENT_URLS;
  const priorClientUrl = process.env.CLIENT_URL;
  const priorEnvMode = env.NODE_ENV;
  env.NODE_ENV = "production";
  process.env.NODE_ENV = "production";
  delete process.env.CLIENT_URLS;
  delete process.env.CLIENT_URL;
  try {
    delete process.env.NODE_ENV;
    assert.throws(validateEnv, /NODE_ENV/);
    process.env.NODE_ENV = "production";
    assert.throws(validateEnv, /Production configuration requires CLIENT_URLS/);
    process.env.CLIENT_URLS = "http://app.example.com";
    assert.throws(validateEnv, /only valid HTTPS origins/);
    process.env.CLIENT_URLS = "https://app.example.com";
    assert.doesNotThrow(validateEnv);
  } finally {
    env.NODE_ENV = priorEnvMode;
    if (priorMode === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = priorMode;
    if (priorClientUrls === undefined) delete process.env.CLIENT_URLS;
    else process.env.CLIENT_URLS = priorClientUrls;
    if (priorClientUrl === undefined) delete process.env.CLIENT_URL;
    else process.env.CLIENT_URL = priorClientUrl;
  }
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
  console.log(`Critical security regression tests: ${tests.length - failed} passed, ${failed} failed`);
  if (failed) process.exitCode = 1;
})();
