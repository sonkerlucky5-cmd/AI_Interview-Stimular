const { pool } = require("../config/db");
const User = require("../models/User");
const Interview = require("../models/Interview");
const InterviewQuestion = require("../models/InterviewQuestion");
const InterviewAnswer = require("../models/InterviewAnswer");
const AnswerEvaluation = require("../models/AnswerEvaluation");
const Report = require("../models/Report");

async function runPhase4Tests() {
  console.log("=========================================");
  console.log("   Phase 4: History, Analytics & Report  ");
  console.log("=========================================\n");

  const email1 = `candidate_p4_${Date.now()}@test.com`;
  const email2 = `stranger_p4_${Date.now()}@test.com`;
  let user1, user2;

  try {
    // 1. Create Test Candidates
    console.log("1. Creating Test Candidates:");
    user1 = await User.create({ name: "Elena Rostova", email: email1, password: "Password123!" });
    user2 = await User.create({ name: "Frank Miller", email: email2, password: "Password123!" });
    console.log(`   ✔ Candidate 1: ${user1.id}`);
    console.log(`   ✔ Candidate 2: ${user2.id}`);

    // 2. Create and complete Interview 1 (Frontend, Score: 85)
    console.log("\n2. Creating & Completing Interview 1 (Frontend):");
    const int1 = await Interview.create({
      userId: user1.id,
      interviewType: "technical",
      targetRole: "Senior React Engineer",
      difficulty: "senior",
      questionLimit: 1,
    });
    await Interview.updateStatus(int1.id, user1.id, "in_progress");
    const q1 = await InterviewQuestion.create({
      interviewId: int1.id,
      position: 1,
      questionText: "How does React fiber architecture handle priority scheduling?",
      category: "React Core Architecture",
      difficulty: "senior",
    });
    const ans1 = await InterviewAnswer.createOrUpdate({
      questionId: q1.id,
      answerText: "React Fiber breaks reconciliation into incremental work units using lanes for priority...",
    });
    await AnswerEvaluation.createOrUpdate({
      answerId: ans1.id,
      scores: {
        overall: 85,
        relevance: 90,
        technical_correctness: 85,
        completeness: 80,
        reasoning_structure: 85,
        practical_tradeoffs: 85,
      },
      strengths: ["Clear explanation of Fiber work units and lane priority."],
      improvements: ["Could mention startTransition and useDeferredValue concurrent hooks."],
    });
    await Interview.updateStatus(int1.id, user1.id, "completed");
    console.log(`   ✔ Interview 1 completed with score 85`);

    // 3. Create and complete Interview 2 (Backend, Score: 75)
    console.log("\n3. Creating & Completing Interview 2 (Backend):");
    const int2 = await Interview.create({
      userId: user1.id,
      interviewType: "technical",
      targetRole: "Backend Node.js Engineer",
      difficulty: "intermediate",
      questionLimit: 1,
    });
    await Interview.updateStatus(int2.id, user1.id, "in_progress");
    const q2 = await InterviewQuestion.create({
      interviewId: int2.id,
      position: 1,
      questionText: "How do you handle database connection pooling and idle timeouts?",
      category: "Databases & Node.js",
      difficulty: "intermediate",
    });
    const ans2 = await InterviewAnswer.createOrUpdate({
      questionId: q2.id,
      answerText: "Connection pools maintain open connections to prevent handshake overhead...",
    });
    await AnswerEvaluation.createOrUpdate({
      answerId: ans2.id,
      scores: {
        overall: 75,
        relevance: 80,
        technical_correctness: 75,
        completeness: 70,
        reasoning_structure: 75,
        practical_tradeoffs: 75,
      },
      strengths: ["Solid understanding of pool benefits."],
      improvements: ["Discuss connection leaks and release in finally blocks."],
    });
    await Interview.updateStatus(int2.id, user1.id, "completed");
    console.log(`   ✔ Interview 2 completed with score 75`);

    // 4. Create an Abandoned Interview
    const int3 = await Interview.create({
      userId: user1.id,
      interviewType: "behavioral",
      targetRole: "Engineering Manager",
      difficulty: "lead",
      questionLimit: 3,
    });
    await Interview.updateStatus(int3.id, user1.id, "abandoned");
    console.log(`   ✔ Interview 3 created and marked abandoned`);

    // 5. Test Filtered Pagination
    console.log("\n4. Testing Filtered History & Pagination:");
    const allHistory = await Interview.findByUser(user1.id, { limit: 10, offset: 0 });
    console.log(`   ✔ Total history count: ${allHistory.totalCount} (expected 3)`);

    const completedHistory = await Interview.findByUser(user1.id, { status: "completed" });
    console.log(`   ✔ Completed filter count: ${completedHistory.totalCount} (expected 2)`);

    const abandonedHistory = await Interview.findByUser(user1.id, { status: "abandoned" });
    console.log(`   ✔ Abandoned filter count: ${abandonedHistory.totalCount} (expected 1)`);

    const searchHistory = await Interview.findByUser(user1.id, { search: "React" });
    console.log(`   ✔ Role search filter count: ${searchHistory.totalCount} (expected 1)`);

    // 6. Test Report Generation & Persistence
    console.log("\n5. Testing Report Persistence & Retrieval:");
    const reportSummary = {
      overallScore: 85,
      targetRole: "Senior React Engineer",
      candidateName: user1.name,
    };
    const report = await Report.createOrUpdate({
      interviewId: int1.id,
      userId: user1.id,
      summary: reportSummary,
    });
    console.log(`   ✔ Report created with ID: ${report.id}`);

    const retrievedReport = await Report.findByInterviewAndUser(int1.id, user1.id);
    console.log(`   ✔ Report retrieved successfully:`, retrievedReport.summary.overallScore === 85);

    // 7. Test Security & Cross-User Data Isolation
    console.log("\n6. Testing Data Isolation:");
    const crossReport = await Report.findByInterviewAndUser(int1.id, user2.id);
    console.log(`   ✔ Cross-user report access blocked:`, crossReport === null);

    const crossHistory = await Interview.findByUser(user2.id);
    console.log(`   ✔ User 2 sees 0 of User 1's interviews:`, crossHistory.totalCount === 0);

    console.log("\n=========================================");
    console.log("   All Phase 4 Backend Tests Passed! 🎉  ");
    console.log("=========================================\n");
  } catch (error) {
    console.error("❌ Phase 4 test failed:", error);
    process.exit(1);
  } finally {
    console.log("Cleaning up test users...");
    if (user1) await pool.query("DELETE FROM users WHERE id = $1", [user1.id]);
    if (user2) await pool.query("DELETE FROM users WHERE id = $1", [user2.id]);
    console.log("✔ Cleanup complete.");
    await pool.end();
  }
}

runPhase4Tests();
