const express = require("express");
const {
  uploadResumeHandler,
  getResumesHandler,
  getResumeByIdHandler,
  deleteResumeHandler,
} = require("../controllers/resumeController");
const requireAuth = require("../middleware/authMiddleware");
const { uploadResume } = require("../middleware/uploadMiddleware");

const router = express.Router();

router.use(requireAuth);

router.post("/", uploadResume, uploadResumeHandler);
router.get("/", getResumesHandler);
router.get("/:id", getResumeByIdHandler);
router.delete("/:id", deleteResumeHandler);

module.exports = router;
