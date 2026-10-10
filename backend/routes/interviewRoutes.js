const express = require("express");
const {
  createInterviewHandler,
  getInterviewsHandler,
  getInterviewByIdHandler,
  startInterviewHandler,
  submitAnswerHandler,
  nextQuestionHandler,
  completeInterviewHandler,
  abandonInterviewHandler,
  getInterviewEvaluationsHandler,
} = require("../controllers/interviewController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.post("/", createInterviewHandler);
router.get("/", getInterviewsHandler);
router.get("/:id", getInterviewByIdHandler);
router.post("/:id/start", startInterviewHandler);
router.post("/:id/answers", submitAnswerHandler);
router.post("/:id/next-question", nextQuestionHandler);
router.post("/:id/complete", completeInterviewHandler);
router.post("/:id/abandon", abandonInterviewHandler);
router.get("/:id/evaluations", getInterviewEvaluationsHandler);

module.exports = router;
