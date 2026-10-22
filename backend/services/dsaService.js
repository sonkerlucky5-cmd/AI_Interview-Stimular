const ApiError = require("../utils/ApiError");
const { env } = require("../config/env");
const Dsa = require("../models/Dsa");
const { createJudge0Runner, LANGUAGE_IDS, MAX_CASES, MAX_INPUT_BYTES, MAX_OUTPUT_BYTES } = require("./judge0Service");

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const MAX_CODE_BYTES = 50 * 1024;
const MAX_EXECUTION_WALL_MS = 60_000;

const validateSubmission = ({ problemId, language, code }) => {
  if (typeof problemId !== "string" || !UUID_RE.test(problemId)) throw new ApiError(400, "problemId must be a valid problem UUID.", "INVALID_PROBLEM_ID");
  if (typeof language !== "string" || !Object.hasOwn(LANGUAGE_IDS, language)) throw new ApiError(400, "language must be javascript or python.", "UNSUPPORTED_LANGUAGE");
  if (typeof code !== "string" || !code.trim()) throw new ApiError(400, "code is required.", "CODE_REQUIRED");
  if (Buffer.byteLength(code, "utf8") > MAX_CODE_BYTES) throw new ApiError(413, "Code must be 50 KB or smaller.", "CODE_TOO_LARGE");
};

const createDsaService = ({ model = Dsa, runner = createJudge0Runner() , config = env } = {}) => ({
  listProblems: () => model.listProblems(),
  async submit({ userId, problemId, language, code }) {
    validateSubmission({ problemId, language, code });
    const problem = await model.findProblemById(problemId);
    if (!problem) throw new ApiError(404, "Problem not found or unavailable.", "PROBLEM_NOT_FOUND");
    const testCases = Array.isArray(problem.test_cases) ? problem.test_cases : [];
    if (!testCases.length || testCases.length > MAX_CASES) throw new ApiError(503, "This problem has no valid test suite configured.", "TEST_SUITE_UNAVAILABLE");
    for (const item of testCases) {
      if (Buffer.byteLength(String(item.input ?? ""), "utf8") > MAX_INPUT_BYTES || Buffer.byteLength(String(item.expected_output ?? ""), "utf8") > MAX_OUTPUT_BYTES) {
        throw new ApiError(503, "This problem's test suite exceeds runner input/output limits.", "TEST_SUITE_INVALID");
      }
    }
    const enabled = config.DSA_EXECUTION_ENABLED === true;
    const securityApproved = config.DSA_SECURITY_REVIEW_APPROVED === true;
    const submission = await model.createSubmission({ userId, problemId, language, code, status: enabled && securityApproved ? "running" : "execution_disabled" });
    if (!enabled) throw new ApiError(503, "DSA execution is disabled. Set DSA_EXECUTION_ENABLED=true only after approval.", "DSA_EXECUTION_DISABLED", { submissionId: submission.id });
    if (!securityApproved) throw new ApiError(503, "DSA runner security review has not been approved. Execution remains disabled.", "DSA_SECURITY_REVIEW_REQUIRED", { submissionId: submission.id });
    try {
      const controller = new AbortController();
      let timer;
      const timeout = new Promise((_, reject) => {
        timer = setTimeout(() => {
          controller.abort();
          reject(new ApiError(504, "Judge0 execution exceeded the 60-second request limit.", "DSA_EXECUTION_TIMEOUT"));
        }, MAX_EXECUTION_WALL_MS);
      });
      const result = await Promise.race([runner({ code, language, problem: { ...problem, test_cases: testCases }, signal: controller.signal }), timeout]).finally(() => clearTimeout(timer));
      await model.finishSubmission({ submissionId: submission.id, ...result });
      return { submissionId: submission.id, createdAt: submission.created_at, ...result };
    } catch (error) {
      await model.finishSubmission({ submissionId: submission.id, verdict: "runner_error", runnerReference: null, results: [], passed: 0, total: testCases.length, executionMs: 0, memoryKb: 0 });
      throw error;
    }
  },
});

module.exports = { createDsaService, validateSubmission, MAX_CODE_BYTES, MAX_EXECUTION_WALL_MS };
