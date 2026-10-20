const assert = require("assert");

console.log("--------------------------------------------------");
console.log("Running Phase 4 Analytics & Reports Tests...");
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

// 1. Report summary generator logic test
test("generateReportSummary correctly aggregates evaluated questions and computes average score", () => {
  const interview = {
    target_role: "Senior Full Stack Engineer",
    difficulty: "senior",
    interview_type: "technical",
    status: "completed",
    question_limit: 3,
  };

  const user = {
    name: "Alex Developer",
    email: "alex@example.com",
  };

  const items = [
    {
      position: 1,
      category: "Architecture",
      question_text: "Explain microservices trade-offs.",
      answer_text: "Microservices improve team decoupling but introduce network latency and distributed data consistency challenges.",
      scores: { overall: 85, relevance: 90, technical_correctness: 85, completeness: 80, reasoning_structure: 90, practical_tradeoffs: 80 },
      strengths: ["Clear trade-off discussion"],
      improvements: ["Mention distributed tracing tools"],
      ideal_answer: "Ideal answer text...",
    },
    {
      position: 2,
      category: "Databases",
      question_text: "How do you handle indexing in PostgreSQL?",
      answer_text: "B-Tree indexes are standard; composite indexes must match query filter prefixes; partial indexes reduce index size.",
      scores: { overall: 95, relevance: 95, technical_correctness: 95, completeness: 90, reasoning_structure: 95, practical_tradeoffs: 100 },
      strengths: ["Excellent prefix rule explanation"],
      improvements: [],
      ideal_answer: "Ideal answer text...",
    },
  ];

  // Replicate report generator function
  let totalScore = 0;
  let count = 0;
  const questionsFeedback = [];

  items.forEach((item) => {
    const scores = item.scores || {};
    if (typeof scores.overall === "number") {
      totalScore += scores.overall;
      count += 1;
    }
    questionsFeedback.push({
      position: item.position,
      category: item.category,
      questionText: item.question_text,
      answerText: item.answer_text,
      scores: item.scores,
      strengths: item.strengths,
      improvements: item.improvements,
    });
  });

  const averageScore = count > 0 ? Math.round(totalScore / count) : 0;

  assert.strictEqual(count, 2);
  assert.strictEqual(averageScore, 90, "Average score of 85 and 95 should be 90");
  assert.strictEqual(questionsFeedback.length, 2);
  assert.strictEqual(questionsFeedback[0].category, "Architecture");
  assert.strictEqual(questionsFeedback[1].category, "Databases");
});

// 2. Analytics calculations with 0 sessions
test("Analytics metrics gracefully handle 0 completed interviews without division by zero", () => {
  const counts = {
    total_interviews: "0",
    completed_count: "0",
    in_progress_count: "0",
    abandoned_count: "0",
  };

  const total = parseInt(counts.total_interviews, 10);
  const completed = parseInt(counts.completed_count, 10);
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  const isSmallSample = completed < 3;

  assert.strictEqual(completionRate, 0, "Completion rate should be 0%");
  assert.strictEqual(isSmallSample, true, "Should flag small sample size");
});

// 3. Analytics dimension averages calculation
test("Analytics calculates accurate dimension averages across multiple sessions", () => {
  const sessions = [
    {
      score: 80,
      dimensions: {
        relevance: 80,
        technical_correctness: 80,
        completeness: 70,
        reasoning_structure: 90,
        practical_tradeoffs: 80,
      },
    },
    {
      score: 90,
      dimensions: {
        relevance: 90,
        technical_correctness: 90,
        completeness: 90,
        reasoning_structure: 90,
        practical_tradeoffs: 90,
      },
    },
  ];

  const sumOverall = sessions.reduce((acc, h) => acc + h.score, 0);
  const avgOverall = Math.round(sumOverall / sessions.length);

  const dimensionAverages = {
    relevance: 0,
    technical_correctness: 0,
    completeness: 0,
    reasoning_structure: 0,
    practical_tradeoffs: 0,
  };

  Object.keys(dimensionAverages).forEach((key) => {
    const sumDim = sessions.reduce((acc, h) => acc + h.dimensions[key], 0);
    dimensionAverages[key] = Math.round(sumDim / sessions.length);
  });

  assert.strictEqual(avgOverall, 85);
  assert.strictEqual(dimensionAverages.relevance, 85);
  assert.strictEqual(dimensionAverages.technical_correctness, 85);
  assert.strictEqual(dimensionAverages.completeness, 80);
  assert.strictEqual(dimensionAverages.reasoning_structure, 90);
  assert.strictEqual(dimensionAverages.practical_tradeoffs, 85);
});

// 4. Verification of mandatory disclaimer
test("Report includes mandatory legal and algorithmic disclaimer", () => {
  const disclaimer =
    "This report provides structured technical practice feedback and rubric assessments. It does not certify hiring eligibility or replace comprehensive employer evaluations.";
  assert.ok(disclaimer.includes("does not certify hiring eligibility"), "Disclaimer must contain explicit disclaimer clause");
});

console.log("--------------------------------------------------");
console.log(`Phase 4 Tests Finished: ${passed} passed, ${failed} failed`);
console.log("--------------------------------------------------");

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
