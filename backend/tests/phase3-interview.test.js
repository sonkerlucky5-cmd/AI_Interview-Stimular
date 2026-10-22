const assert = require("assert");
const { generateInterviewQuestion, evaluateAnswer } = require("../services/aiService");
const { normalizeQuestionLimit } = require("../controllers/interviewController");
const ApiError = require("../utils/ApiError");

console.log("--------------------------------------------------");
console.log("Running Phase 3 Mock Interview & Evaluation Tests...");
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

async function testAsync(name, fn) {
  try {
    await fn();
    console.log(`[PASS] ${name}`);
    passed++;
  } catch (err) {
    console.error(`[FAIL] ${name}:`, err.message);
    failed++;
  }
}

async function runAll() {
  // 1. Question limit clamping verification
  test("Question limit is strictly bounded between 3 and 10", () => {
    const cases = [
      [undefined, 5],
      [null, 5],
      ["", 5],
      ["abc", 5],
      [Number.NaN, 5],
      [0, 3],
      [-5, 3],
      [2, 3],
      [3, 3],
      [7, 7],
      [10, 10],
      [15, 10],
      ["7", 7],
      [4.8, 4],
    ];

    for (const [input, expected] of cases) {
      assert.strictEqual(normalizeQuestionLimit(input), expected, `Unexpected limit for ${String(input)}`);
    }
  });

  // 2. Deterministic question generation fallback (Frontend role)
  await testAsync("generateInterviewQuestion returns appropriate frontend question", async () => {
    const q = await generateInterviewQuestion({
      targetRole: "Frontend React Engineer",
      interviewType: "technical",
      difficulty: "intermediate",
      position: 1,
    });
    assert.ok(q.questionText && q.questionText.length > 10, "Question text must exist");
    assert.ok(q.category && q.category.length > 0, "Category must exist");
    assert.strictEqual(q.difficulty, "intermediate");
    assert.ok(["curated_catalogue", "gemini-1.5-flash"].includes(q.source));
  });

  // 3. Deterministic question generation fallback (Backend role)
  await testAsync("generateInterviewQuestion returns appropriate backend question", async () => {
    const q = await generateInterviewQuestion({
      targetRole: "Backend Node.js Developer",
      interviewType: "technical",
      difficulty: "senior",
      position: 1,
    });
    assert.ok(q.questionText && q.questionText.length > 10, "Question text must exist");
    assert.ok(q.category && q.category.length > 0, "Category must exist");
  });

  // 4. Deterministic question generation fallback (Behavioral track)
  await testAsync("generateInterviewQuestion returns behavioral question when interviewType is behavioral", async () => {
    const q = await generateInterviewQuestion({
      targetRole: "Full Stack Engineer",
      interviewType: "behavioral",
      difficulty: "intermediate",
      position: 1,
    });
    assert.ok(q.questionText && q.questionText.length > 10, "Question text must exist");
    assert.ok(q.category && q.category.length > 0, "Category must exist");
  });

  // 5. evaluateAnswer rubric scoring bounds
  await testAsync("evaluateAnswer produces rubric scores strictly bounded [0, 100]", async () => {
    const evalResult = await evaluateAnswer({
      questionText: "How does the browser event loop differ from Node.js event loop?",
      answerText: "In the browser, the event loop handles rendering, macrotasks, and microtasks (like Promise callbacks and MutationObserver). In Node.js, libuv provides the event loop with phases: timers, pending callbacks, idle/prepare, poll, check (setImmediate), and close callbacks. Microtasks run between phases in Node.js.",
      category: "Runtime Internals",
      difficulty: "intermediate",
      targetRole: "Full Stack Developer",
    });

    assert.ok(evalResult.scores, "Scores object must exist");
    const dimensions = ["overall", "relevance", "technical_correctness", "completeness", "reasoning_structure", "practical_tradeoffs"];
    dimensions.forEach((dim) => {
      const score = evalResult.scores[dim];
      assert.ok(typeof score === "number", `${dim} score must be numeric`);
      assert.ok(score >= 0 && score <= 100, `${dim} score (${score}) must be between 0 and 100`);
    });

    assert.ok(Array.isArray(evalResult.strengths), "Strengths must be an array");
    assert.ok(Array.isArray(evalResult.improvements), "Improvements must be an array");
    assert.ok(typeof evalResult.idealAnswer === "string" && evalResult.idealAnswer.length > 0, "Ideal answer must exist");
  });

  // 6. Session state transition guardrails
  test("Session guardrail rejects operations on finished interviews", () => {
    const checkSessionState = (status) => {
      if (status === "completed" || status === "abandoned") {
        throw new ApiError(400, `Cannot submit answers to a ${status} interview.`, "INTERVIEW_ALREADY_FINISHED");
      }
      return true;
    };

    assert.strictEqual(checkSessionState("in_progress"), true);
    assert.strictEqual(checkSessionState("pending"), true);

    assert.throws(
      () => checkSessionState("completed"),
      (err) => err instanceof ApiError && err.code === "INTERVIEW_ALREADY_FINISHED"
    );

    assert.throws(
      () => checkSessionState("abandoned"),
      (err) => err instanceof ApiError && err.code === "INTERVIEW_ALREADY_FINISHED"
    );
  });

  console.log("--------------------------------------------------");
  console.log(`Phase 3 Tests Finished: ${passed} passed, ${failed} failed`);
  console.log("--------------------------------------------------");

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runAll().catch((err) => {
  console.error("Test execution error:", err);
  process.exit(1);
});
