const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const ApiError = require("../utils/ApiError");

const uploadDir = path.join(__dirname, "../uploads/resumes");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueKey = `${crypto.randomUUID()}${ext}`;
    cb(null, uniqueKey);
  },
});

const allowedMimeTypes = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
];

const allowedExtensions = [".pdf", ".docx"];

const fileFilter = (_req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowedExtensions.includes(ext)) {
    return cb(
      new ApiError(400, "Unsupported file format. Please upload a PDF or DOCX document."),
      false
    );
  }

  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(
      new ApiError(400, "Invalid MIME type. Only PDF and DOCX files are permitted."),
      false
    );
  }

  cb(null, true);
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter,
});

/**
 * Validates file signature (magic bytes) to ensure file content matches its declared format.
 */
const validateFileSignature = async (filePath, ext) => {
  const buffer = Buffer.alloc(8);
  const fd = await fs.promises.open(filePath, "r");
  try {
    await fd.read(buffer, 0, 8, 0);
  } finally {
    await fd.close();
  }

  if (ext === ".pdf") {
    // PDF magic bytes: %PDF (0x25, 0x50, 0x44, 0x46)
    const isPdf = buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46;
    if (!isPdf) {
      throw new ApiError(400, "Corrupted or invalid PDF file signature.");
    }
  } else if (ext === ".docx") {
    // DOCX is a ZIP container: PK\x03\x04 (0x50, 0x4b, 0x03, 0x04)
    const isZip = buffer[0] === 0x50 && buffer[1] === 0x4b && buffer[2] === 0x03 && buffer[3] === 0x04;
    if (!isZip) {
      throw new ApiError(400, "Corrupted or invalid DOCX file signature.");
    }
  }
};

module.exports = {
  uploadResume: upload.single("resume"),
  validateFileSignature,
  uploadDir,
};
