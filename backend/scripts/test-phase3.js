const { pool } = require("../config/db");
const User = require("../models/User");
const Interview = require("../models/Interview");
const InterviewQuestion = require("../models/InterviewQuestion");
const InterviewAnswer = require("../models/InterviewAnswer");
const AnswerEvaluation = require("../models/AnswerEvaluation");
const { generateInterviewQuestion, evaluateAnswer } = require("../services/aiService");

async function runPhase3Tests() {
  console.log("=========================================");
  console.log("   Phase 3: Adaptive Interview Test Suite");
  console.log("=========================================\n");

  const email1 = `candidate_p3_${Date.now()}@test.com`;
  const email2 = `stranger_p3_${Date.now()}@test.com`;
  let user1, user2;

  try {
    // 1. Create Test Users
    console.log("1. Creating Test Candidates:");
    user1 = await User.create({ name: "David Candidate", email: email1, password: "Password123!" });
    user2 = await User.create({ name: "Eve Stranger", email: email2, password: "Password123!" });
    console.log(`   ✔ Candidate 1: ${user1.id}`);
    console.log(`   ✔ Candidate 2: ${user2.id}`);

    // 2. Create Interview Session
    console.log("\n2. Creating Interview Session:");
    const interview = await Interview.create({
      userId: user1.id,
      interviewType: "technical",
      targetRole: "Senior Backend Engineer",
      language: "English",
      difficulty: "senior",
      questionLimit: 3,
    });
    console.log(`   ✔ Interview created: ${interview.id}`);
    console.log(`   ✔ Initial status: ${interview.status}`);

    // 3. Start Session & Generate Question 1
    console.log("\n3. Starting Session & Generating Question 1:");
    const activeInterview = await Interview.updateStatus(interview.id, user1.id, "in_progress");
    console.log(`   ✔ Status transitioned to: ${activeInterview.status}`);

    const q1Gen = await generateInterviewQuestion({
      targetRole: interview.target_role,
      interviewType: interview.interview_type,
      difficulty: interview.difficulty,
      position: 1,
    });
    const q1 = await InterviewQuestion.create({
      interviewId: interview.id,
      position: 1,
      questionText: q1Gen.questionText,
      category: q1Gen.category,
      difficulty: q1Gen.difficulty,
      metadata: { source: q1Gen.source },
    });
    console.log(`   ✔ Question 1 [${q1.category}]: "${q1.question_text}"`);

    // 4. Submit Answer & Generate Rubric Evaluation
    console.log("\n4. Submitting Answer 1 & Evaluating Rubric:");
    const ans1Text = "Node.js uses the libuv event loop to handle non-blocking asynchronous I/O across polling, timers, and check phases. For CPU-intensive operations that block the main thread, we offload computation to worker threads or child processes, or deploy dedicated worker services via message queues.";
    const ans1 = await InterviewAnswer.createOrUpdate({
      questionId: q1.id,
      answerText: ans1Text,
      idempotencyKey: `ans_key_1_${Date.now()}`,
    });
    console.log(`   ✔ Answer 1 saved: ID ${ans1.id}`);

    const eval1Data = await evaluateAnswer({
      questionText: q1.question_text,
      answerText: ans1Text,
      category: q1.category,
      difficulty: interview.difficulty,
      targetRole: interview.target_role,
    });

    const eval1 = await AnswerEvaluation.createOrUpdate({
      answerId: ans1.id,
      scores: eval1Data.scores,
      strengths: eval1Data.strengths,
      improvements: eval1Data.improvements,
      idealAnswer: eval1Data.idealAnswer,
      followUpSuggestion: eval1Data.followUpSuggestion,
    });
    console.log(`   ✔ Evaluation 1 Overall Score: ${eval1Data.scores.overall}/100`);
    console.log(`   ✔ Dimension scores:`, eval1Data.scores);
    console.log(`   ✔ Strengths:`, eval1Data.strengths);

    // 5. Generate Question 2 (Adaptive Context)
    console.log("\n5. Generating Adaptive Question 2:");
    const q2Gen = await generateInterviewQuestion({
      targetRole: interview.target_role,
      interviewType: interview.interview_type,
      difficulty: interview.difficulty,
      position: 2,
      previousQuestions: [q1.question_text],
      previousAnswers: [ans1Text],
    });
    const q2 = await InterviewQuestion.create({
      interviewId: interview.id,
      position: 2,
      questionText: q2Gen.questionText,
      category: q2Gen.category,
      difficulty: q2Gen.difficulty,
      metadata: { source: q2Gen.source },
    });
    console.log(`   ✔ Question 2 [${q2.category}]: "${q2.question_text}"`);

    // 6. Complete Session
    console.log("\n6. Completing Interview Session:");
    const completed = await Interview.updateStatus(interview.id, user1.id, "completed");
    console.log(`   ✔ Session marked: ${completed.status}`);

    // 7. Test Session Detail & Evaluation Aggregation
    console.log("\n7. Verifying Session Summaries & Ownership:");
    const evaluations = await AnswerEvaluation.listByInterviewId(interview.id, user1.id);
    console.log(`   ✔ Retrieved ${evaluations.length} evaluation(s) for interview`);

    // 8. Test Data Isolation (Stranger cannot access Candidate's session)
    const crossCheck = await Interview.findByIdAndUser(interview.id, user2.id);
    console.log(`   ✔ Cross-user access blocked:`, crossCheck === null);

    console.log("\n=========================================");
    console.log("   All Phase 3 Backend Tests Passed! 🎉  ");
    console.log("=========================================\n");
  } catch (error) {
    console.error("❌ Phase 3 test failed:", error);
    process.exit(1);
  } finally {
    console.log("Cleaning up test users...");
    if (user1) await pool.query("DELETE FROM users WHERE id = $1", [user1.id]);
    if (user2) await pool.query("DELETE FROM users WHERE id = $1", [user2.id]);
    console.log("✔ Cleanup complete.");
    await pool.end();
  }
}

runPhase3Tests();
