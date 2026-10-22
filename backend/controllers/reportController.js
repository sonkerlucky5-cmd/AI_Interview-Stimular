const Interview = require("../models/Interview");
const Report = require("../models/Report");
const ApiError = require("../utils/ApiError");

const escapeHtml = (value) => String(value ?? "").replace(/[&<>\"']/g, (character) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '\"': "&quot;",
  "'": "&#39;",
}[character]));

const generateReportSummary = (interview, items, user) => {
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
      answerText: item.answer_text || "No response recorded.",
      scores: item.scores || {},
      strengths: item.strengths || [],
      improvements: item.improvements || [],
      idealAnswer: item.ideal_answer || "",
    });
  });

  const averageScore = count > 0 ? Math.round(totalScore / count) : 0;

  return {
    reportTitle: `Technical Interview Assessment — ${interview.target_role}`,
    candidateName: user.name,
    candidateEmail: user.email,
    targetRole: interview.target_role,
    difficulty: interview.difficulty,
    interviewType: interview.interview_type,
    status: interview.status,
    totalQuestions: interview.question_limit,
    completedQuestions: count,
    overallScore: averageScore,
    generatedAt: new Date().toISOString(),
    questionsFeedback,
    disclaimer:
      "This report provides structured technical practice feedback and rubric assessments. It does not certify hiring eligibility or replace comprehensive employer evaluations.",
  };
};

const createOrGetReportHandler = async (req, res, next) => {
  try {
    const interviewId = req.params.id;
    const sessionData = await Interview.getFullSessionDetails(interviewId, req.user.id);

    if (!sessionData) {
      throw new ApiError(404, "Interview session not found.", "INTERVIEW_NOT_FOUND");
    }

    const { interview, items } = sessionData;
    const summary = generateReportSummary(interview, items, req.user);

    const reportRecord = await Report.createOrUpdate({
      interviewId,
      userId: req.user.id,
      summary,
    });

    res.status(200).json({
      success: true,
      data: reportRecord,
    });
  } catch (error) {
    next(error);
  }
};

const getPrintableHtmlHandler = async (req, res, next) => {
  try {
    const interviewId = req.params.id;
    const sessionData = await Interview.getFullSessionDetails(interviewId, req.user.id);

    if (!sessionData) {
      throw new ApiError(404, "Interview session not found.", "INTERVIEW_NOT_FOUND");
    }

    const { interview, items } = sessionData;
    const summary = generateReportSummary(interview, items, req.user);

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${escapeHtml(summary.reportTitle)} - ${escapeHtml(summary.candidateName)}</title>
  <style>
    @media print {
      body { margin: 0; padding: 20px; font-size: 11pt; color: #000; background: #fff; }
      .no-print { display: none !important; }
      .page-break { page-break-after: always; }
      .glass-card { border: 1px solid #ccc !important; box-shadow: none !important; }
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.5;
      color: #1e293b;
      background: #f8fafc;
      padding: 30px;
      max-width: 850px;
      margin: 0 auto;
    }
    .header {
      border-bottom: 2px solid #2563eb;
      padding-bottom: 15px;
      margin-bottom: 25px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .brand-title { font-size: 24px; font-weight: 800; color: #0f172a; margin: 0; }
    .brand-sub { color: #64748b; font-size: 14px; margin-top: 4px; }
    .score-circle {
      text-align: right;
    }
    .score-number { font-size: 38px; font-weight: 800; color: #2563eb; line-height: 1; }
    .meta-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 15px;
      background: #fff;
      padding: 15px;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
      margin-bottom: 25px;
    }
    .meta-item span { display: block; font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 600; }
    .meta-item strong { font-size: 14px; color: #0f172a; }
    .question-block {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;
      break-inside: avoid;
    }
    .question-title { font-size: 16px; font-weight: 700; color: #0f172a; margin: 0 0 10px; }
    .tag { display: inline-block; padding: 2px 8px; background: #eff6ff; color: #1d4ed8; font-size: 11px; font-weight: 600; border-radius: 4px; margin-bottom: 10px; }
    .answer-box { background: #f8fafc; border-left: 3px solid #94a3b8; padding: 10px 14px; font-size: 13px; color: #334155; margin-bottom: 15px; }
    .feedback-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 12px; }
    .strengths-box { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 10px; font-size: 12px; }
    .strengths-box strong { color: #15803d; }
    .improvements-box { background: #fff1f2; border: 1px solid #fecdd3; border-radius: 6px; padding: 10px; font-size: 12px; }
    .improvements-box strong { color: #be123c; }
    .ideal-box { background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 6px; padding: 10px; font-size: 12px; color: #475569; }
    .disclaimer-footer { font-size: 11px; color: #94a3b8; text-align: center; margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 15px; }
    .btn-print {
      background: #2563eb; color: #fff; border: none; padding: 10px 20px; font-weight: 600; border-radius: 6px; cursor: pointer; margin-bottom: 20px;
    }
  </style>
</head>
<body>
  <div class="no-print" style="text-align: right;">
    <button class="btn-print" onclick="window.print()">🖨️ Print or Save as PDF</button>
  </div>

  <div class="header">
    <div>
      <h1 class="brand-title">AI Interview Assessment Report</h1>
      <div class="brand-sub">Candidate: <strong>${escapeHtml(summary.candidateName)}</strong> (${escapeHtml(summary.candidateEmail)})</div>
    </div>
    <div class="score-circle">
      <div class="score-number">${escapeHtml(summary.overallScore)}%</div>
      <small style="color: #64748b;">Overall Rubric Score</small>
    </div>
  </div>

  <div class="meta-grid">
    <div class="meta-item">
      <span>Target Role</span>
      <strong>${escapeHtml(summary.targetRole)}</strong>
    </div>
    <div class="meta-item">
      <span>Seniority</span>
      <strong>${escapeHtml(summary.difficulty)}</strong>
    </div>
    <div class="meta-item">
      <span>Questions Answered</span>
      <strong>${escapeHtml(summary.completedQuestions)} of ${escapeHtml(summary.totalQuestions)}</strong>
    </div>
    <div class="meta-item">
      <span>Date Generated</span>
      <strong>${escapeHtml(new Date(summary.generatedAt).toLocaleDateString())}</strong>
    </div>
  </div>

  <h2 style="font-size: 18px; color: #0f172a; margin-bottom: 15px;">Question-by-Question Evaluation</h2>

  ${summary.questionsFeedback
    .map(
      (q) => `
    <div class="question-block">
      <div style="display: flex; justify-content: space-between;">
        <span class="tag">Question ${escapeHtml(q.position)} • ${escapeHtml(q.category)}</span>
        <strong style="color: #2563eb; font-size: 14px;">Score: ${escapeHtml(q.scores.overall || 0)}/100</strong>
      </div>
      <h3 class="question-title">${escapeHtml(q.questionText)}</h3>
      
      <div class="answer-box">
        <strong>Candidate Answer:</strong><br>
        ${escapeHtml(q.answerText)}
      </div>

      <div class="feedback-grid">
        <div class="strengths-box">
          <strong>Key Strengths:</strong>
          <ul style="margin: 5px 0 0; padding-left: 18px;">
            ${(q.strengths || []).map((s) => `<li>${escapeHtml(s)}</li>`).join("")}
          </ul>
        </div>
        <div class="improvements-box">
          <strong>Areas for Growth:</strong>
          <ul style="margin: 5px 0 0; padding-left: 18px;">
            ${(q.improvements || []).map((imp) => `<li>${escapeHtml(imp)}</li>`).join("")}
          </ul>
        </div>
      </div>

      ${
        q.idealAnswer
          ? `
        <div class="ideal-box">
          <strong>Exemplary Model Response:</strong><br>
          ${escapeHtml(q.idealAnswer)}
        </div>
      `
          : ""
      }
    </div>
  `
    )
    .join("")}

  <div class="disclaimer-footer">
    ${escapeHtml(summary.disclaimer)}
  </div>
</body>
</html>
`;

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(200).send(html);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  escapeHtml,
  createOrGetReportHandler,
  getPrintableHtmlHandler,
};
