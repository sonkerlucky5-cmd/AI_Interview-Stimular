const express = require("express");
const {
  createPlanHandler,
  getPlansHandler,
  getPlanHandler,
  updatePlanHandler,
  deletePlanHandler,
  updatePlanItemHandler,
  addPlanItemHandler,
  deletePlanItemHandler,
  regeneratePlanHandler,
} = require("../controllers/learningPlanController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.post("/", createPlanHandler);
router.get("/", getPlansHandler);
router.get("/:id", getPlanHandler);
router.patch("/:id", updatePlanHandler);
router.delete("/:id", deletePlanHandler);

// Item routes
router.patch("/:id/items/:itemId", updatePlanItemHandler);
router.post("/:id/items", addPlanItemHandler);
router.delete("/:id/items/:itemId", deletePlanItemHandler);

// Plan regeneration
router.post("/:id/regenerate", regeneratePlanHandler);

module.exports = router;
