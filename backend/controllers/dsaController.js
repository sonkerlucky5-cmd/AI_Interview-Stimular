const catchAsync = require("../utils/catchAsync");
const { createDsaService } = require("../services/dsaService");

const dsaService = createDsaService();

const getProblemsHandler = catchAsync(async (_req, res) => {
  const problems = await dsaService.listProblems();
  res.status(200).json({ success: true, data: problems });
});

const submitCodeHandler = catchAsync(async (req, res) => {
  const result = await dsaService.submit({ userId: req.user.id, ...req.body });
  res.status(200).json({ success: true, message: "Submission evaluated.", data: result });
});

module.exports = { getProblemsHandler, submitCodeHandler };
