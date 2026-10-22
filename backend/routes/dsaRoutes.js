const express = require("express");
const { getProblemsHandler, submitCodeHandler } = require("../controllers/dsaController");
const { protect } = require("../middleware/authMiddleware");
const rateLimit = require("../middleware/rateLimitMiddleware");

const router = express.Router();

router.get("/problems", getProblemsHandler);
router.post("/submit", protect, rateLimit({ windowMs: 60 * 1000, max: 5, prefix: "dsa-submit" }), submitCodeHandler);

module.exports = router;
