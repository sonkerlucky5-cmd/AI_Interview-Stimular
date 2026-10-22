const ApiError = require("../utils/ApiError");
const { env } = require("../config/env");

const LANGUAGE_IDS = { javascript: 63, python: 71 };
const MAX_CASES = 20;
const MAX_INPUT_BYTES = 16 * 1024;
const MAX_OUTPUT_BYTES = 16 * 1024;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const normalizeOutput = (value) => String(value || "").replace(/\r\n/g, "\n").trimEnd();

const createJudge0Runner = ({ fetchImpl = global.fetch, config = env, wait = sleep } = {}) => async ({ code, language, problem, signal }) => {
  if (!config.JUDGE0_API_URL || !config.JUDGE0_API_KEY) {
    throw new ApiError(503, "DSA execution is enabled but JUDGE0_API_URL or JUDGE0_API_KEY is missing.", "JUDGE0_CONFIGURATION_MISSING");
  }
  if (!fetchImpl) throw new ApiError(503, "This Node.js runtime does not provide fetch for Judge0 requests.", "JUDGE0_FETCH_UNAVAILABLE");
  const languageId = LANGUAGE_IDS[language];
  if (!languageId) throw new ApiError(400, "Supported languages are JavaScript and Python.", "UNSUPPORTED_LANGUAGE");
  const baseUrl = config.JUDGE0_API_URL.replace(/\/+$/, "");
  let rapidApiHost;
  try { rapidApiHost = new URL(baseUrl).host; } catch { rapidApiHost = undefined; }
  const headers = { "Content-Type": "application/json", "X-RapidAPI-Key": config.JUDGE0_API_KEY, ...(rapidApiHost ? { "X-RapidAPI-Host": rapidApiHost } : {}) };
  const requestSignal = () => signal ? AbortSignal.any([signal, AbortSignal.timeout(8000)]) : AbortSignal.timeout(8000);
  const testResults = [];
  let totalExecutionMs = 0;
  let peakMemoryKb = 0;

  for (const [index, testCase] of problem.test_cases.entries()) {
    const input = String(testCase.input ?? "");
    const expected = String(testCase.expected_output ?? "");
    if (Buffer.byteLength(input, "utf8") > MAX_INPUT_BYTES || Buffer.byteLength(expected, "utf8") > MAX_OUTPUT_BYTES) {
      throw new ApiError(500, "A stored DSA test case exceeds the configured runner input/output limit.", "INVALID_STORED_TEST_CASE");
    }
    let response;
    try {
      response = await fetchImpl(`${baseUrl}/submissions?base64_encoded=true&wait=false`, {
        method: "POST", headers,
        body: JSON.stringify({
          source_code: Buffer.from(code).toString("base64"),
          language_id: languageId,
          stdin: Buffer.from(input).toString("base64"),
          expected_output: Buffer.from(expected).toString("base64"),
          cpu_time_limit: Math.min(Math.max(problem.time_limit_ms || 2000, 100), 10000) / 1000,
          memory_limit: Math.min(Math.max(problem.memory_limit_kb || 131072, 16384), 262144),
        }),
        signal: requestSignal(),
      });
    } catch (error) {
      throw new ApiError(502, `Judge0 submission request failed: ${error.name === "TimeoutError" ? "request timed out" : "runner unavailable"}.`, "JUDGE0_UNAVAILABLE");
    }
    if (!response.ok) throw new ApiError(502, `Judge0 rejected the submission (HTTP ${response.status}).`, "JUDGE0_REQUEST_FAILED");
    const submission = await response.json();
    if (!submission.token) throw new ApiError(502, "Judge0 did not return a submission token.", "JUDGE0_INVALID_RESPONSE");

    let result = null;
    for (let poll = 0; poll < 20; poll += 1) {
      await wait(500);
      try {
        response = await fetchImpl(`${baseUrl}/submissions/${encodeURIComponent(submission.token)}?base64_encoded=true&fields=token,status,stdout,stderr,compile_output,time,memory`, {
          headers, signal: requestSignal(),
        });
      } catch (error) {
        throw new ApiError(502, `Judge0 result request failed: ${error.name === "TimeoutError" ? "request timed out" : "runner unavailable"}.`, "JUDGE0_UNAVAILABLE");
      }
      if (!response.ok) throw new ApiError(502, `Judge0 result request failed (HTTP ${response.status}).`, "JUDGE0_REQUEST_FAILED");
      result = await response.json();
      if (result.status?.id > 2) break;
    }
    if (!result || result.status?.id <= 2) {
      testResults.push({ case: index + 1, passed: false, status: "Processing Limit Exceeded" });
      break;
    }
    const stdout = Buffer.from(result.stdout || "", "base64").toString("utf8");
    const status = result.status.description || "Unknown";
    const passed = result.status.id === 3 && normalizeOutput(stdout) === normalizeOutput(expected);
    totalExecutionMs += Math.round((Number(result.time) || 0) * 1000);
    peakMemoryKb = Math.max(peakMemoryKb, Number(result.memory) || 0);
    testResults.push({ case: index + 1, passed, status: passed ? "Accepted" : result.status.id === 3 ? "Wrong Answer" : status, timeMs: Math.round((Number(result.time) || 0) * 1000), memoryKb: Number(result.memory) || 0 });
    if (!passed) break;
  }
  const passed = testResults.filter((item) => item.passed).length;
  const verdict = passed === problem.test_cases.length ? "accepted" : (testResults.find((item) => !item.passed)?.status || "wrong_answer").toLowerCase().replace(/[^a-z0-9]+/g, "_");
  return { verdict, results: testResults, passed, total: problem.test_cases.length, executionMs: totalExecutionMs, memoryKb: peakMemoryKb };
};

module.exports = { createJudge0Runner, LANGUAGE_IDS, normalizeOutput, MAX_CASES, MAX_INPUT_BYTES, MAX_OUTPUT_BYTES };
