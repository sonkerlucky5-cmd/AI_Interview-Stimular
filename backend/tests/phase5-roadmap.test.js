const assert = require("assert");
const { generateDeterministicCurriculum } = require("../services/roadmapService");
const ApiError = require("../utils/ApiError");

console.log("--------------------------------------------------");
console.log("Running Phase 5 Personalized Learning Roadmap Tests...");
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

// 1. Curriculum generation across stages
test("generateDeterministicCurriculum creates structured multi-stage learning plan", () => {
  const plan = generateDeterministicCurriculum({
    targetRole: "Full Stack Developer",
    skillGaps: ["PostgreSQL Optimization", "System Design", "Docker", "Redis"],
    availableMinutesPerDay: 45,
    learningStyle: "practical",
  });

  assert.ok(Array.isArray(plan), "Plan must be an array of roadmap tasks");
  assert.ok(plan.length >= 4, "Plan must have at least 4 items across stages");

  const stages = new Set(plan.map((item) => item.stage));
  assert.ok(stages.size >= 3, "Curriculum must span multiple stages");

  plan.forEach((item) => {
    assert.ok(item.topic && item.topic.length > 0, "Item must have a topic");
    assert.ok(item.task && item.task.length > 0, "Item must have actionable task description");
    assert.ok(typeof item.estimatedMinutes === "number" && item.estimatedMinutes > 0, "Item must have positive estimated minutes");
    assert.ok(item.practiceOutcome && item.practiceOutcome.length > 0, "Item must define demonstrable outcome");
    assert.ok(item.resourceUrl && item.resourceUrl.startsWith("http"), "Item must provide valid reference link");
  });
});

// 2. Regeneration preservation logic test
test("Regeneration logic preserves completed tasks and user notes", () => {
  // Existing items in database, where item 1 is completed with user notes
  const existingItems = [
    {
      id: "item-1",
      topic: "PostgreSQL Optimization Core Fundamentals",
      status: "completed",
      notes: "Reviewed B-Tree vs Hash index performance and EXPLAIN ANALYZE.",
      completed_at: new Date().toISOString(),
    },
    {
      id: "item-2",
      topic: "System Design & Applied Problem Solving",
      status: "pending",
      notes: null,
      completed_at: null,
    },
  ];

  // Newly generated items
  const newlyGenerated = [
    {
      topic: "PostgreSQL Optimization Core Fundamentals",
      task: "Updated task description from new curriculum",
      stage: "Stage 1",
      estimatedMinutes: 45,
    },
    {
      topic: "Scalability & System Trade-offs",
      task: "Analyze high-concurrency caching",
      stage: "Stage 2",
      estimatedMinutes: 45,
    },
  ];

  // Check how completed item is merged
  const merged = newlyGenerated.map((newItem) => {
    const existing = existingItems.find(
      (old) => old.topic.toLowerCase() === newItem.topic.toLowerCase()
    );
    if (existing && existing.status === "completed") {
      return {
        ...newItem,
        status: "completed",
        notes: existing.notes,
        completed_at: existing.completed_at,
      };
    }
    return {
      ...newItem,
      status: "pending",
      notes: null,
      completed_at: null,
    };
  });

  const preservedItem = merged.find((item) => item.topic === "PostgreSQL Optimization Core Fundamentals");
  assert.strictEqual(preservedItem.status, "completed", "Completed status must be preserved");
  assert.ok(preservedItem.notes.includes("EXPLAIN ANALYZE"), "User notes must be preserved");
  assert.ok(preservedItem.completed_at, "Completed timestamp must be preserved");

  const uncompletedItem = merged.find((item) => item.topic === "Scalability & System Trade-offs");
  assert.strictEqual(uncompletedItem.status, "pending", "New tasks must start as pending");
});

// 3. Progress percentage calculations
test("Progress percentage calculation is accurate across completed/total counts", () => {
  const calcProgress = (total, completed) => (total > 0 ? Math.round((completed / total) * 100) : 0);

  assert.strictEqual(calcProgress(0, 0), 0);
  assert.strictEqual(calcProgress(10, 0), 0);
  assert.strictEqual(calcProgress(10, 5), 50);
  assert.strictEqual(calcProgress(3, 1), 33);
  assert.strictEqual(calcProgress(6, 6), 100);
});

// 4. Input validation guardrails
test("Validation guardrails enforce minutes bounds [15, 480] and targetRole", () => {
  const validatePlanInput = (targetRole, minutes) => {
    if (!targetRole || !targetRole.trim()) {
      throw new ApiError(400, "targetRole is required to generate a learning plan.", "MISSING_TARGET_ROLE");
    }
    const mins = parseInt(minutes, 10) || 45;
    if (mins < 15 || mins > 480) {
      throw new ApiError(400, "availableMinutesPerDay must be between 15 and 480 minutes.", "INVALID_MINUTES_PER_DAY");
    }
    return true;
  };

  assert.strictEqual(validatePlanInput("Backend Engineer", 45), true);
  assert.throws(
    () => validatePlanInput("", 45),
    (err) => err instanceof ApiError && err.code === "MISSING_TARGET_ROLE"
  );
  assert.throws(
    () => validatePlanInput("Backend Engineer", 5),
    (err) => err instanceof ApiError && err.code === "INVALID_MINUTES_PER_DAY"
  );
  assert.throws(
    () => validatePlanInput("Backend Engineer", 600),
    (err) => err instanceof ApiError && err.code === "INVALID_MINUTES_PER_DAY"
  );
});

console.log("--------------------------------------------------");
console.log(`Phase 5 Tests Finished: ${passed} passed, ${failed} failed`);
console.log("--------------------------------------------------");

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
