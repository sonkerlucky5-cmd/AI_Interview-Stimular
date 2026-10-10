const express = require("express");
const {
  getAnalyticsOverview,
  getSkillsAnalytics,
} = require("../controllers/analyticsController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.get("/overview", getAnalyticsOverview);
router.get("/skills", getSkillsAnalytics);

module.exports = router;
