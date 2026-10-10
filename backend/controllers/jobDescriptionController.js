const JobDescription = require("../models/JobDescription");
const ApiError = require("../utils/ApiError");

const createJobDescriptionHandler = async (req, res, next) => {
  try {
    const { title, company, description, requirements } = req.body;

    if (!title || !title.trim()) {
      throw new ApiError(400, "Job title is required.");
    }
    if (!description || !description.trim()) {
      throw new ApiError(400, "Job description is required.");
    }

    const job = await JobDescription.create({
      userId: req.user.id,
      title: title.trim(),
      company: company ? company.trim() : null,
      description: description.trim(),
      requirements: Array.isArray(requirements)
        ? requirements
        : typeof requirements === "string"
        ? requirements.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
    });

    res.status(201).json({
      success: true,
      message: "Job description created successfully.",
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

const getJobDescriptionsHandler = async (req, res, next) => {
  try {
    const jobs = await JobDescription.findByUser(req.user.id);
    res.status(200).json({
      success: true,
      data: jobs,
    });
  } catch (error) {
    next(error);
  }
};

const getJobDescriptionByIdHandler = async (req, res, next) => {
  try {
    const job = await JobDescription.findByIdAndUser(req.params.id, req.user.id);
    if (!job) {
      throw new ApiError(404, "Job description not found.");
    }

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

const updateJobDescriptionHandler = async (req, res, next) => {
  try {
    const { title, company, description, requirements } = req.body;

    const existing = await JobDescription.findByIdAndUser(req.params.id, req.user.id);
    if (!existing) {
      throw new ApiError(404, "Job description not found.");
    }

    const updated = await JobDescription.updateByIdAndUser(req.params.id, req.user.id, {
      title: title !== undefined ? title.trim() : undefined,
      company: company !== undefined ? company.trim() : undefined,
      description: description !== undefined ? description.trim() : undefined,
      requirements: Array.isArray(requirements)
        ? requirements
        : typeof requirements === "string"
        ? requirements.split(",").map((s) => s.trim()).filter(Boolean)
        : undefined,
    });

    res.status(200).json({
      success: true,
      message: "Job description updated successfully.",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

const deleteJobDescriptionHandler = async (req, res, next) => {
  try {
    const existing = await JobDescription.findByIdAndUser(req.params.id, req.user.id);
    if (!existing) {
      throw new ApiError(404, "Job description not found.");
    }

    await JobDescription.deleteByIdAndUser(req.params.id, req.user.id);

    res.status(200).json({
      success: true,
      message: "Job description deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createJobDescriptionHandler,
  getJobDescriptionsHandler,
  getJobDescriptionByIdHandler,
  updateJobDescriptionHandler,
  deleteJobDescriptionHandler,
};
