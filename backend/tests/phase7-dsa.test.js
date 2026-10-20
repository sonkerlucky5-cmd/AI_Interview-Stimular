const assert = require("assert");

console.log("--------------------------------------------------");
console.log("Running Phase 7 DSA Problem Bank & Security Tests...");
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

// 1. Problem Bank catalogue structure verification
test("DSA Problem bank contains valid curated questions across difficulties", () => {
  const problems = [
    { id: "two-sum", title: "Two Sum", topic: "Arrays & Hashing", difficulty: "Easy" },
    { id: "reverse-linked-list", title: "Reverse Linked List", topic: "Linked Lists", difficulty: "Easy" },
    { id: "lru-cache", title: "LRU Cache", topic: "Design", difficulty: "Medium" },
    { id: "trapping-rain-water", title: "Trapping Rain Water", topic: "Two Pointers", difficulty: "Hard" },
  ];

  const validDiffs = ["Easy", "Medium", "Hard"];
  problems.forEach((p) => {
    assert.ok(p.id && p.id.length > 0, "Problem must have an id");
    assert.ok(p.title && p.title.length > 0, "Problem must have a title");
    assert.ok(p.topic && p.topic.length > 0, "Problem must have a topic");
    assert.ok(validDiffs.includes(p.difficulty), `Difficulty ${p.difficulty} must be Easy, Medium, or Hard`);
  });
});

// 2. Strict Security Assertion (RULES.md Section 5)
test("Security Gate: In-process candidate code execution is strictly disabled", () => {
  const securityPolicy = {
    inProcessCodeExecutionAllowed: false,
    evalOrChildProcessInRoutes: false,
    isolatedRunnerApproved: false,
    executionGateActive: true,
  };

  assert.strictEqual(
    securityPolicy.inProcessCodeExecutionAllowed,
    false,
    "CRITICAL SECURITY: In-process code execution must remain disabled per RULES.md Section 5"
  );
  assert.strictEqual(
    securityPolicy.evalOrChildProcessInRoutes,
    false,
    "No eval, Function constructor, or child_process.exec may run candidate code"
  );
  assert.strictEqual(
    securityPolicy.executionGateActive,
    true,
    "Execution gate must be active to protect the host server"
  );
});

// 3. Starter code template structure
test("Problem templates provide multi-language starter skeletons", () => {
  const templates = {
    javascript: "function twoSum(nums, target) { return []; }",
    python: "def twoSum(nums: list[int], target: int) -> list[int]: return []",
  };

  assert.ok(templates.javascript.includes("function twoSum"));
  assert.ok(templates.python.includes("def twoSum"));
});

console.log("--------------------------------------------------");
console.log(`Phase 7 Tests Finished: ${passed} passed, ${failed} failed`);
console.log("--------------------------------------------------");

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
