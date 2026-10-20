const fs = require("fs");
const path = require("path");
const Resume = require("../models/Resume");
const { validateFileSignature, uploadDir } = require("../middleware/uploadMiddleware");
const { extractTextFromFile, extractSkillsAndEntities } = require("../services/resumeService");
const ApiError = require("../utils/ApiError");

const uploadResumeHandler = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new ApiError(400, "Please upload a resume file (PDF or DOCX).", "NO_FILE_UPLOADED");
    }

    const ext = path.extname(req.file.originalname).toLowerCase();

    // 1. Validate magic bytes / signature
    try {
      await validateFileSignature(req.file.path, ext);
    } catch (sigErr) {
      // Clean up invalid file
      await fs.promises.unlink(req.file.path).catch(() => {});
      throw sigErr;
    }

    // 2. Extract plain text
    let parsedText = "";
    try {
      parsedText = await extractTextFromFile(req.file.path, req.file.mimetype);
    } catch (parseErr) {
      await fs.promises.unlink(req.file.path).catch(() => {});
      throw parseErr;
    }

    // 3. Extract skills & structured metrics
    const extractedData = extractSkillsAndEntities(parsedText);

    // 4. Save to Database
    const resume = await Resume.create({
      userId: req.user.id,
      fileName: req.file.originalname,
      storageKey: req.file.filename,
      mimeType: req.file.mimetype,
      sizeBytes: req.file.size,
      parsedText,
      extractedData,
    });

    res.status(201).json({
      success: true,
      message: "Resume uploaded and parsed successfully.",
      data: resume,
    });
  } catch (error) {
    next(error);
  }
};

const getResumesHandler = async (req, res, next) => {
  try {
    const resumes = await Resume.findByUser(req.user.id);
    res.status(200).json({
      success: true,
      data: resumes,
    });
  } catch (error) {
    next(error);
  }
};

const getResumeByIdHandler = async (req, res, next) => {
  try {
    const resume = await Resume.findByIdAndUser(req.params.id, req.user.id);
    if (!resume) {
      throw new ApiError(404, "Resume not found.", "RESUME_NOT_FOUND");
    }

    res.status(200).json({
      success: true,
      data: resume,
    });
  } catch (error) {
    next(error);
  }
};

const deleteResumeHandler = async (req, res, next) => {
  try {
    const resume = await Resume.findByIdAndUser(req.params.id, req.user.id);
    if (!resume) {
      throw new ApiError(404, "Resume not found.", "RESUME_NOT_FOUND");
    }

    // 1. Delete DB record
    await Resume.hardDelete(req.params.id, req.user.id);

    // 2. Delete physical file if exists
    if (resume.storage_key) {
      const filePath = path.join(uploadDir, resume.storage_key);
      await fs.promises.unlink(filePath).catch(() => {});
    }

    res.status(200).json({
      success: true,
      message: "Resume deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadResumeHandler,
  getResumesHandler,
  getResumeByIdHandler,
  deleteResumeHandler,
};
