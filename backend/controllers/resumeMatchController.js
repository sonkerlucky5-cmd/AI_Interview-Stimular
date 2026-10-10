const Resume = require("../models/Resume");
const JobDescription = require("../models/JobDescription");
const ResumeMatch = require("../models/ResumeMatch");
const { calculateResumeMatch } = require("../services/matchingService");
const ApiError = require("../utils/ApiError");

const createMatchHandler = async (req, res, next) => {
  try {
    const { resumeId, jobDescriptionId } = req.body;

    if (!resumeId) {
      throw new ApiError(400, "Please provide a valid resumeId.");
    }
    if (!jobDescriptionId) {
      throw new ApiError(400, "Please provide a valid jobDescriptionId.");
    }

    // 1. Fetch and verify ownership of resume
    const resume = await Resume.findByIdAndUser(resumeId, req.user.id);
    if (!resume) {
      throw new ApiError(404, "Resume not found or does not belong to your account.");
    }

    // 2. Fetch and verify ownership of job description
    const job = await JobDescription.findByIdAndUser(jobDescriptionId, req.user.id);
    if (!job) {
      throw new ApiError(404, "Job description not found or does not belong to your account.");
    }

    // 3. Compute matching result
    const resumeSkills = resume.extracted_data?.skills || [];
    const matchData = calculateResumeMatch(resume.parsed_text || "", resumeSkills, job);

    // 4. Persist match record
    const match = await ResumeMatch.create({
      userId: req.user.id,
      resumeId,
      jobDescriptionId,
      matchData,
      scoringVersion: matchData.scoringVersion,
    });

    res.status(201).json({
      success: true,
      message: "Resume-to-job matching computed successfully.",
      data: {
        ...match,
        resume_file_name: resume.file_name,
        job_title: job.title,
        job_company: job.company,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getMatchesHandler = async (req, res, next) => {
  try {
    const matches = await ResumeMatch.findByUser(req.user.id);
    res.status(200).json({
      success: true,
      data: matches,
    });
  } catch (error) {
    next(error);
  }
};

const getMatchByIdHandler = async (req, res, next) => {
  try {
    const match = await ResumeMatch.findByIdAndUser(req.params.id, req.user.id);
    if (!match) {
      throw new ApiError(404, "Resume match report not found.");
    }

    res.status(200).json({
      success: true,
      data: match,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createMatchHandler,
  getMatchesHandler,
  getMatchByIdHandler,
};
