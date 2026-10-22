const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const { createDsaService } = require("../services/dsaService");

const dsaService = createDsaService();
const SUBMISSION_FIELDS = new Set(["problemId", "language", "code"]);

const getProblemsHandler = catchAsync(async (_req, res) => {
  const problems = await dsaService.listProblems();
  res.status(200).json({ success: true, data: problems });
});

const createSubmitCodeHandler = (submit = (input) => dsaService.submit(input)) => catchAsync(async (req, res) => {
  const body = req.body || {};
  const unexpectedFields = Object.keys(body).filter((field) => !SUBMISSION_FIELDS.has(field));
  if (unexpectedFields.length > 0) {
    throw new ApiError(400, "Unexpected submission fields.", "UNEXPECTED_SUBMISSION_FIELD");
  }

  const result = await submit({
    problemId: body.problemId,
    language: body.language,
    code: body.code,
    userId: req.user.id,
  });
  res.status(200).json({ success: true, message: "Submission evaluated.", data: result });
});

const submitCodeHandler = createSubmitCodeHandler();

module.exports = { getProblemsHandler, submitCodeHandler, createSubmitCodeHandler };
