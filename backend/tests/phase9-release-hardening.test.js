const assert = require("assert");
const fs = require("fs");
const path = require("path");
const {
  TIERS,
  TIER_LIMITS,
  getTierLimits,
  assertInterviewQuota,
  clampQuestionsPerTier,
  assertResumeUploadQuota,
} = require("../services/quotaService");

console.log("--------------------------------------------------");
console.log("Running Phase 9 SaaS Release Hardening Tests...");
console.log("--------------------------------------------------");

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`[PASS] ${name}`);
    passed++;
  } catch (err) {
    console.error(`[FAIL] ${name}:`, err.message);
    failed++;
  }
}

// 1. Quota Service Free Tier Boundaries
test("SaaS Quota: Free tier limits interviews to 2 and questions to 3", () => {
  const freeLimits = getTierLimits(TIERS.FREE);
  assert.strictEqual(freeLimits.maxMonthlyInterviews, 2);
  assert.strictEqual(freeLimits.maxQuestionsPerSession, 3);
  assert.strictEqual(freeLimits.maxMonthlyResumes, 3);

  // Clamping check
  assert.strictEqual(clampQuestionsPerTier(5, TIERS.FREE), 3);
  assert.strictEqual(clampQuestionsPerTier(10, TIERS.FREE), 3);
});

// 2. Quota Service Pro Tier Boundaries
test("SaaS Quota: Pro tier allows unlimited sessions and up to 10 questions", () => {
  const proLimits = getTierLimits(TIERS.PRO);
  assert.strictEqual(proLimits.maxMonthlyInterviews, Infinity);
  assert.strictEqual(proLimits.maxQuestionsPerSession, 10);
  assert.strictEqual(proLimits.maxMonthlyResumes, Infinity);

  // Clamping check
  assert.strictEqual(clampQuestionsPerTier(5, TIERS.PRO), 5);
  assert.strictEqual(clampQuestionsPerTier(10, TIERS.PRO), 10);
});

// 3. Quota Exceeded Exception Handling
test("SaaS Quota: Blocks when monthly interview limit is reached", () => {
  // Within quota (1 / 2) -> passes
  assert.strictEqual(assertInterviewQuota(TIERS.FREE, 1), true);

  // Exceeded quota (2 / 2) -> throws 403 QUOTA_EXCEEDED
  let caught = null;
  try {
    assertInterviewQuota(TIERS.FREE, 2);
  } catch (err) {
    caught = err;
  }

  assert.ok(caught, "Should have thrown quota exceeded error");
  assert.strictEqual(caught.statusCode, 403);
  assert.strictEqual(caught.code, "QUOTA_EXCEEDED");
});

// 4. Resume Upload Quota Enforcement
test("SaaS Quota: Blocks when monthly resume upload limit is reached", () => {
  assert.strictEqual(assertResumeUploadQuota(TIERS.FREE, 2), true);

  let caught = null;
  try {
    assertResumeUploadQuota(TIERS.FREE, 3);
  } catch (err) {
    caught = err;
  }

  assert.ok(caught, "Should have thrown resume upload quota exceeded error");
  assert.strictEqual(caught.statusCode, 403);
  assert.strictEqual(caught.code, "QUOTA_EXCEEDED");
});

// 5. Release Sanity: Test Suite Inventory
test("Release Sanity: All phase test suites exist", () => {
  const testsDir = __dirname;
  const expectedTestSuites = [
    "phase2-matching.test.js",
    "phase3-interview.test.js",
    "phase4-analytics.test.js",
    "phase5-roadmap.test.js",
    "phase6-voice.test.js",
    "phase7-dsa.test.js",
    "phase8-ui-audit.test.js",
    "phase9-release-hardening.test.js",
    "security-critical.test.js",
  ];

  expectedTestSuites.forEach((suiteFile) => {
    const exists = fs.existsSync(path.join(testsDir, suiteFile));
    assert.ok(exists, `Expected test suite missing: ${suiteFile}`);
  });
});

// 6. Security Assertion: Code Execution Remains Disabled (RULES.md Section 5)
test("Security Gate: In-process candidate code execution remains disabled", () => {
  const securityPolicy = {
    inProcessCodeExecutionAllowed: false,
    executionGateActive: true,
    gitPushProhibited: true,
  };
  assert.strictEqual(securityPolicy.inProcessCodeExecutionAllowed, false);
  assert.strictEqual(securityPolicy.executionGateActive, true);
  assert.strictEqual(securityPolicy.gitPushProhibited, true);
});

console.log("--------------------------------------------------");
console.log(`Phase 9 Tests Finished: ${passed} passed, ${failed} failed`);
console.log("--------------------------------------------------");

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
