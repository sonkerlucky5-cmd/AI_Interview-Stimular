const express = require("express");
const {
  createMatchHandler,
  getMatchesHandler,
  getMatchByIdHandler,
} = require("../controllers/resumeMatchController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.post("/", createMatchHandler);
router.get("/", getMatchesHandler);
router.get("/:id", getMatchByIdHandler);

module.exports = router;
