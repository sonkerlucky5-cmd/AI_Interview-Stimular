const Interview = require("../models/Interview");
const InterviewQuestion = require("../models/InterviewQuestion");
const InterviewAnswer = require("../models/InterviewAnswer");
const AnswerEvaluation = require("../models/AnswerEvaluation");
const Resume = require("../models/Resume");
const JobDescription = require("../models/JobDescription");
const { generateInterviewQuestion, evaluateAnswer } = require("../services/aiService");
const ApiError = require("../utils/ApiError");

const normalizeQuestionLimit = (value) => {
  if (value === null || value === undefined) return 5;
  if (typeof value === "string" && value.trim() === "") return 5;
  if (typeof value !== "number" && typeof value !== "string") return 5;

  const parsed = Number(value);
  if (Number.isNaN(parsed)) return 5;

  return Math.min(10, Math.max(3, Math.floor(parsed)));
};

const createInterviewHandler = async (req, res, next) => {
  try {
    const {
      targetRole,
      interviewType = "technical",
      difficulty = "intermediate",
      questionLimit = 5,
      language = "English",
      resumeId,
      jobDescriptionId,
    } = req.body;

    if (!targetRole || !targetRole.trim()) {
      throw new ApiError(400, "Target role is required.", "MISSING_TARGET_ROLE");
    }

    const boundedLimit = normalizeQuestionLimit(questionLimit);

    // Optional ownership check for resume
    if (resumeId) {
      const resume = await Resume.findByIdAndUser(resumeId, req.user.id);
      if (!resume) throw new ApiError(404, "Selected resume not found or unauthorized.", "RESUME_NOT_FOUND");
    }

    // Optional ownership check for job description
    if (jobDescriptionId) {
      const job = await JobDescription.findByIdAndUser(jobDescriptionId, req.user.id);
      if (!job) throw new ApiError(404, "Selected job description not found or unauthorized.", "JOB_NOT_FOUND");
    }

    const interview = await Interview.create({
      userId: req.user.id,
      resumeId: resumeId || null,
      jobDescriptionId: jobDescriptionId || null,
      interviewType,
      targetRole: targetRole.trim(),
      language,
      difficulty,
      questionLimit: boundedLimit,
    });

    res.status(201).json({
      success: true,
      message: "Interview session created.",
      data: interview,
    });
  } catch (error) {
    next(error);
  }
};

const getInterviewsHandler = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
    const offset = (pageNum - 1) * limitNum;

    const result = await Interview.findByUser(req.user.id, {
      status,
      search,
      limit: limitNum,
      offset,
    });

    res.status(200).json({
      success: true,
      data: result.items,
      pagination: {
        totalCount: result.totalCount,
        page: result.page,
        totalPages: result.totalPages,
        limit: limitNum,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getInterviewByIdHandler = async (req, res, next) => {
  try {
    const sessionDetails = await Interview.getFullSessionDetails(req.params.id, req.user.id);
    if (!sessionDetails) {
      throw new ApiError(404, "Interview session not found.");
    }

    res.status(200).json({
      success: true,
      data: sessionDetails,
    });
  } catch (error) {
    next(error);
  }
};

const startInterviewHandler = async (req, res, next) => {
  try {
    const interview = await Interview.findByIdAndUser(req.params.id, req.user.id);
    if (!interview) {
      throw new ApiError(404, "Interview session not found.", "INTERVIEW_NOT_FOUND");
    }

    // Transition state
    let activeInterview = interview;
    if (interview.status === "pending") {
      activeInterview = await Interview.updateStatus(interview.id, req.user.id, "in_progress");
    }

    // Check if Question 1 exists
    let firstQuestion = await InterviewQuestion.findByInterviewAndPosition(interview.id, 1);
    if (!firstQuestion) {
      const generated = await generateInterviewQuestion({
        targetRole: interview.target_role,
        interviewType: interview.interview_type,
        difficulty: interview.difficulty,
        position: 1,
        resumeText: interview.resume_parsed_text || "",
        jobDescription: interview.job_description || "",
      });

      firstQuestion = await InterviewQuestion.create({
        interviewId: interview.id,
        position: 1,
        questionText: generated.questionText,
        category: generated.category,
        difficulty: generated.difficulty,
        metadata: { source: generated.source },
      });
    }

    res.status(200).json({
      success: true,
      data: {
        interview: activeInterview,
        currentQuestion: firstQuestion,
      },
    });
  } catch (error) {
    next(error);
  }
};

const submitAnswerHandler = async (req, res, next) => {
  try {
    const { questionId, answerText, transcript, idempotencyKey } = req.body;
    const interviewId = req.params.id;

    if (!questionId) throw new ApiError(400, "questionId is required.", "MISSING_QUESTION_ID");
    if (!answerText || !answerText.trim()) throw new ApiError(400, "Answer text cannot be empty.", "EMPTY_ANSWER_ERROR");

    const interview = await Interview.findByIdAndUser(interviewId, req.user.id);
    if (!interview) throw new ApiError(404, "Interview not found.", "INTERVIEW_NOT_FOUND");

    if (interview.status === "completed" || interview.status === "abandoned") {
      throw new ApiError(400, `Cannot submit answers to a ${interview.status} interview.`, "INTERVIEW_ALREADY_FINISHED");
    }

    // Verify question belongs to interview
    const question = await InterviewQuestion.findByInterviewAndPosition(interviewId, req.body.position || 1);
    const targetQId = question?.id || questionId;

    // 1. Save Answer
    const answer = await InterviewAnswer.createOrUpdate({
      questionId: targetQId,
      answerText: answerText.trim(),
      transcript: transcript || null,
      idempotencyKey: idempotencyKey || null,
    });

    // 2. Generate Rubric Evaluation
    const evaluationData = await evaluateAnswer({
      questionText: question ? question.question_text : "Technical Interview Question",
      answerText: answerText.trim(),
      category: question?.category || "General",
      difficulty: interview.difficulty,
      targetRole: interview.target_role,
    });

    // 3. Persist Evaluation
    const evaluation = await AnswerEvaluation.createOrUpdate({
      answerId: answer.id,
      scores: evaluationData.scores,
      strengths: evaluationData.strengths,
      improvements: evaluationData.improvements,
      idealAnswer: evaluationData.idealAnswer,
      followUpSuggestion: evaluationData.followUpSuggestion,
      rubricVersion: evaluationData.rubricVersion,
      modelVersion: evaluationData.modelVersion,
    });

    res.status(200).json({
      success: true,
      message: "Answer submitted and evaluated.",
      data: {
        answer,
        evaluation,
      },
    });
  } catch (error) {
    next(error);
  }
};

const nextQuestionHandler = async (req, res, next) => {
  try {
    const interviewId = req.params.id;
    const interview = await Interview.findByIdAndUser(interviewId, req.user.id);
    if (!interview) throw new ApiError(404, "Interview not found.", "INTERVIEW_NOT_FOUND");

    if (interview.status === "completed" || interview.status === "abandoned") {
      throw new ApiError(400, `Cannot navigate questions in a ${interview.status} interview.`, "INTERVIEW_ALREADY_FINISHED");
    }

    const existingQuestions = await InterviewQuestion.listByInterview(interviewId);
    const nextPosition = existingQuestions.length + 1;

    // Check if question limit reached
    if (existingQuestions.length >= interview.question_limit) {
      const completed = await Interview.updateStatus(interviewId, req.user.id, "completed");
      return res.status(200).json({
        success: true,
        isCompleted: true,
        message: "You have completed all questions in this session!",
        interview: completed,
      });
    }

    // Collect previous questions and answers for context
    const sessionData = await Interview.getFullSessionDetails(interviewId, req.user.id);
    const prevQTexts = sessionData.items.map((it) => it.question_text);
    const prevATexts = sessionData.items.map((it) => it.answer_text || "");

    const generated = await generateInterviewQuestion({
      targetRole: interview.target_role,
      interviewType: interview.interview_type,
      difficulty: interview.difficulty,
      position: nextPosition,
      previousQuestions: prevQTexts,
      previousAnswers: prevATexts,
      resumeText: interview.resume_parsed_text || "",
      jobDescription: interview.job_description || "",
    });

    const nextQ = await InterviewQuestion.create({
      interviewId,
      position: nextPosition,
      questionText: generated.questionText,
      category: generated.category,
      difficulty: generated.difficulty,
      metadata: { source: generated.source },
    });

    res.status(200).json({
      success: true,
      isCompleted: false,
      data: nextQ,
    });
  } catch (error) {
    next(error);
  }
};

const completeInterviewHandler = async (req, res, next) => {
  try {
    const interview = await Interview.findByIdAndUser(req.params.id, req.user.id);
    if (!interview) throw new ApiError(404, "Interview not found.");

    const updated = await Interview.updateStatus(req.params.id, req.user.id, "completed");
    res.status(200).json({
      success: true,
      message: "Interview marked as completed.",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

const abandonInterviewHandler = async (req, res, next) => {
  try {
    const interview = await Interview.findByIdAndUser(req.params.id, req.user.id);
    if (!interview) throw new ApiError(404, "Interview not found.");

    const updated = await Interview.updateStatus(req.params.id, req.user.id, "abandoned");
    res.status(200).json({
      success: true,
      message: "Interview session marked as abandoned.",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

const getInterviewEvaluationsHandler = async (req, res, next) => {
  try {
    const interview = await Interview.findByIdAndUser(req.params.id, req.user.id);
    if (!interview) throw new ApiError(404, "Interview not found.", "INTERVIEW_NOT_FOUND");

    const evaluations = await AnswerEvaluation.listByInterviewId(req.params.id, req.user.id);

    // Compute aggregated score
    let totalScore = 0;
    let answeredCount = 0;
    const dimensionAverages = {
      relevance: 0,
      technical_correctness: 0,
      completeness: 0,
      reasoning_structure: 0,
      practical_tradeoffs: 0,
    };

    evaluations.forEach((ev) => {
      const scores = ev.scores || {};
      if (typeof scores.overall === "number") {
        totalScore += scores.overall;
        answeredCount += 1;
        dimensionAverages.relevance += scores.relevance || 0;
        dimensionAverages.technical_correctness += scores.technical_correctness || 0;
        dimensionAverages.completeness += scores.completeness || 0;
        dimensionAverages.reasoning_structure += scores.reasoning_structure || 0;
        dimensionAverages.practical_tradeoffs += scores.practical_tradeoffs || 0;
      }
    });

    const averageOverall = answeredCount > 0 ? Math.round(totalScore / answeredCount) : 0;
    if (answeredCount > 0) {
      Object.keys(dimensionAverages).forEach((key) => {
        dimensionAverages[key] = Math.round(dimensionAverages[key] / answeredCount);
      });
    }

    res.status(200).json({
      success: true,
      data: {
        interview,
        summary: {
          totalQuestions: interview.question_limit,
          evaluatedCount: answeredCount,
          averageOverallScore: averageOverall,
          dimensionAverages,
        },
        evaluations,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  normalizeQuestionLimit,
  createInterviewHandler,
  getInterviewsHandler,
  getInterviewByIdHandler,
  startInterviewHandler,
  submitAnswerHandler,
  nextQuestionHandler,
  completeInterviewHandler,
  abandonInterviewHandler,
  getInterviewEvaluationsHandler,
};
