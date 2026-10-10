const express = require("express");
const {
  createOrGetReportHandler,
  getPrintableHtmlHandler,
} = require("../controllers/reportController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.post("/:id/report", createOrGetReportHandler);
router.get("/:id/report", createOrGetReportHandler);
router.get("/:id/report/html", getPrintableHtmlHandler);

module.exports = router;
