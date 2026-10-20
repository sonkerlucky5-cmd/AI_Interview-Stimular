const LearningPlan = require("../models/LearningPlan");
const Interview = require("../models/Interview");
const { generateLearningRoadmap } = require("../services/roadmapService");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");

const createPlanHandler = catchAsync(async (req, res) => {
  const {
    targetRole,
    skillGaps = [],
    availableMinutesPerDay = 45,
    targetDate = null,
    learningStyle = "balanced",
    sourceInterviewId = null,
    title = null,
  } = req.body;

  if (!targetRole || !targetRole.trim()) {
    throw new ApiError(400, "targetRole is required to generate a learning plan.", "MISSING_TARGET_ROLE");
  }

  const minutesPerDay = parseInt(availableMinutesPerDay, 10) || 45;
  if (minutesPerDay < 15 || minutesPerDay > 480) {
    throw new ApiError(400, "availableMinutesPerDay must be between 15 and 480 minutes.", "INVALID_MINUTES_PER_DAY");
  }

  let resolvedGaps = Array.isArray(skillGaps) ? skillGaps.filter(Boolean) : [];

  // If source interview is provided and no manual gaps, extract areas for improvement
  if (sourceInterviewId && resolvedGaps.length === 0) {
    try {
      const session = await Interview.getFullSessionDetails(sourceInterviewId, req.user.id);
      if (session && session.items) {
        const extractedImprovements = [];
        session.items.forEach((item) => {
          if (Array.isArray(item.improvements)) {
            extractedImprovements.push(...item.improvements);
          }
        });
        resolvedGaps = extractedImprovements.slice(0, 5);
      }
    } catch {
      // Continue with default gaps if source lookup fails
    }
  }

  // Generate roadmap items
  const generatedItems = await generateLearningRoadmap({
    targetRole: targetRole.trim(),
    skillGaps: resolvedGaps,
    availableMinutesPerDay: minutesPerDay,
    learningStyle,
  });

  // Create learning plan record
  const plan = await LearningPlan.create({
    userId: req.user.id,
    sourceInterviewId,
    targetRole: targetRole.trim(),
    availableMinutesPerDay: minutesPerDay,
    startDate: new Date(),
    targetDate: targetDate || null,
    status: "active",
    title,
    learningStyle,
    skillGaps: resolvedGaps,
  });

  // Insert items
  const createdItems = await LearningPlan.createItems(plan.id, generatedItems);

  plan.items = createdItems;
  plan.totalItems = createdItems.length;
  plan.completedItems = 0;
  plan.progressPercentage = 0;

  return res.status(201).json({
    success: true,
    message: "Personalized learning roadmap generated successfully.",
    data: plan,
  });
});

const getPlansHandler = catchAsync(async (req, res) => {
  const plans = await LearningPlan.findByUser(req.user.id);

  const formattedPlans = plans.map((plan) => {
    const total = parseInt(plan.total_items, 10) || 0;
    const completed = parseInt(plan.completed_items, 10) || 0;
    return {
      ...plan,
      totalItems: total,
      completedItems: completed,
      progressPercentage: total > 0 ? Math.round((completed / total) * 100) : 0,
      totalHours: Math.round(((parseInt(plan.total_minutes, 10) || 0) / 60) * 10) / 10,
    };
  });

  return res.status(200).json({
    success: true,
    data: formattedPlans,
  });
});

const getPlanHandler = catchAsync(async (req, res) => {
  const plan = await LearningPlan.findById(req.params.id, req.user.id);

  if (!plan) {
    throw new ApiError(404, "Learning plan not found or access denied.", "PLAN_NOT_FOUND");
  }

  return res.status(200).json({
    success: true,
    data: plan,
  });
});

const updatePlanHandler = catchAsync(async (req, res) => {
  const { title, status, availableMinutesPerDay, targetDate } = req.body;

  const validStatuses = ["active", "paused", "completed", "archived"];
  if (status && !validStatuses.includes(status)) {
    throw new ApiError(400, `Invalid status. Must be one of: ${validStatuses.join(", ")}`);
  }

  const updated = await LearningPlan.update(req.params.id, req.user.id, {
    title,
    status,
    available_minutes_per_day: availableMinutesPerDay,
    target_date: targetDate,
  });

  if (!updated) {
    throw new ApiError(404, "Learning plan not found or access denied.", "PLAN_NOT_FOUND");
  }

  const fullPlan = await LearningPlan.findById(req.params.id, req.user.id);

  return res.status(200).json({
    success: true,
    message: "Learning plan updated successfully.",
    data: fullPlan,
  });
});

const deletePlanHandler = catchAsync(async (req, res) => {
  const deleted = await LearningPlan.delete(req.params.id, req.user.id);

  if (!deleted) {
    throw new ApiError(404, "Learning plan not found or access denied.", "PLAN_NOT_FOUND");
  }

  return res.status(200).json({
    success: true,
    message: "Learning plan deleted successfully.",
  });
});

const updatePlanItemHandler = catchAsync(async (req, res) => {
  const { id: planId, itemId } = req.params;
  const { status, notes, task, estimatedMinutes, targetDate } = req.body;

  const validStatuses = ["pending", "in_progress", "completed"];
  if (status && !validStatuses.includes(status)) {
    throw new ApiError(400, `Invalid item status. Must be one of: ${validStatuses.join(", ")}`);
  }

  const updated = await LearningPlan.updateItem(itemId, planId, req.user.id, {
    status,
    notes,
    task,
    estimated_minutes: estimatedMinutes,
    target_date: targetDate,
  });

  if (!updated) {
    throw new ApiError(404, "Plan item not found or unauthorized.", "ITEM_NOT_FOUND");
  }

  const fullPlan = await LearningPlan.findById(planId, req.user.id);

  return res.status(200).json({
    success: true,
    message: "Task status updated successfully.",
    data: {
      item: updated,
      planSummary: {
        totalItems: fullPlan.totalItems,
        completedItems: fullPlan.completedItems,
        progressPercentage: fullPlan.progressPercentage,
      },
    },
  });
});

const addPlanItemHandler = catchAsync(async (req, res) => {
  const { id: planId } = req.params;
  const { topic, task, estimatedMinutes = 30, stage = "Custom Tasks", practiceOutcome = "", resourceUrl = null, notes = null } = req.body;

  if (!topic || !task) {
    throw new ApiError(400, "Both topic and task are required to add a custom task.", "MISSING_TASK_DATA");
  }

  const item = await LearningPlan.addItem(planId, req.user.id, {
    topic,
    task,
    estimatedMinutes: parseInt(estimatedMinutes, 10) || 30,
    stage,
    practiceOutcome,
    resourceUrl,
    notes,
  });

  if (!item) {
    throw new ApiError(404, "Learning plan not found or unauthorized.", "PLAN_NOT_FOUND");
  }

  return res.status(201).json({
    success: true,
    message: "Custom task added to roadmap.",
    data: item,
  });
});

const deletePlanItemHandler = catchAsync(async (req, res) => {
  const { id: planId, itemId } = req.params;

  const deleted = await LearningPlan.deleteItem(itemId, planId, req.user.id);
  if (!deleted) {
    throw new ApiError(404, "Plan item not found or unauthorized.", "ITEM_NOT_FOUND");
  }

  return res.status(200).json({
    success: true,
    message: "Task removed from roadmap.",
  });
});

const regeneratePlanHandler = catchAsync(async (req, res) => {
  const { id: planId } = req.params;

  const existingPlan = await LearningPlan.findById(planId, req.user.id);
  if (!existingPlan) {
    throw new ApiError(404, "Learning plan not found or unauthorized.", "PLAN_NOT_FOUND");
  }

  // Generate new items based on existing plan parameters
  const newItems = await generateLearningRoadmap({
    targetRole: existingPlan.target_role,
    skillGaps: existingPlan.skill_gaps || [],
    availableMinutesPerDay: existingPlan.available_minutes_per_day || 45,
    learningStyle: existingPlan.learning_style || "balanced",
  });

  const updatedPlan = await LearningPlan.regeneratePlanPreservingCompleted(
    planId,
    req.user.id,
    newItems
  );

  return res.status(200).json({
    success: true,
    message: "Roadmap regenerated successfully. Completed tasks have been preserved.",
    data: updatedPlan,
  });
});

module.exports = {
  createPlanHandler,
  getPlansHandler,
  getPlanHandler,
  updatePlanHandler,
  deletePlanHandler,
  updatePlanItemHandler,
  addPlanItemHandler,
  deletePlanItemHandler,
  regeneratePlanHandler,
};
