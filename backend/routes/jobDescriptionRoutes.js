const express = require("express");
const {
  createJobDescriptionHandler,
  getJobDescriptionsHandler,
  getJobDescriptionByIdHandler,
  updateJobDescriptionHandler,
  deleteJobDescriptionHandler,
} = require("../controllers/jobDescriptionController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.post("/", createJobDescriptionHandler);
router.get("/", getJobDescriptionsHandler);
router.get("/:id", getJobDescriptionByIdHandler);
router.patch("/:id", updateJobDescriptionHandler);
router.delete("/:id", deleteJobDescriptionHandler);

module.exports = router;
