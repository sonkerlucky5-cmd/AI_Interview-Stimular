const ApiError = require("../utils/ApiError");

const TIERS = {
  FREE: "free",
  PRO: "pro",
  TEAM: "team",
};

const TIER_LIMITS = {
  [TIERS.FREE]: {
    name: "Starter (Free)",
    maxMonthlyInterviews: 2,
    maxQuestionsPerSession: 3,
    maxMonthlyResumes: 3,
    monthlyTokenQuota: 25000,
    voiceEnabled: false,
    pdfDownloadEnabled: false,
  },
  [TIERS.PRO]: {
    name: "Career Pro",
    maxMonthlyInterviews: Infinity,
    maxQuestionsPerSession: 10,
    maxMonthlyResumes: Infinity,
    monthlyTokenQuota: 500000,
    voiceEnabled: true,
    pdfDownloadEnabled: true,
  },
  [TIERS.TEAM]: {
    name: "Team / Campus",
    maxMonthlyInterviews: Infinity,
    maxQuestionsPerSession: 20,
    maxMonthlyResumes: Infinity,
    monthlyTokenQuota: 2000000,
    voiceEnabled: true,
    pdfDownloadEnabled: true,
  },
};

/**
 * Returns tier limits configuration for a given tier key.
 * @param {string} tier
 * @returns {object}
 */
function getTierLimits(tier = TIERS.FREE) {
  const normalizedTier = (tier || TIERS.FREE).toLowerCase();
  return TIER_LIMITS[normalizedTier] || TIER_LIMITS[TIERS.FREE];
}

/**
 * Validates whether the candidate can initiate a new mock interview session.
 * @param {string} userTier
 * @param {number} currentMonthlyInterviews
 * @returns {boolean}
 * @throws {ApiError}
 */
function assertInterviewQuota(userTier = TIERS.FREE, currentMonthlyInterviews = 0) {
  const limits = getTierLimits(userTier);
  if (currentMonthlyInterviews >= limits.maxMonthlyInterviews) {
    throw new ApiError(
      403,
      `Monthly interview quota reached. Free tier allows ${limits.maxMonthlyInterviews} mock sessions per month. Upgrade to Career Pro for unlimited sessions.`,
      "QUOTA_EXCEEDED",
      { tier: userTier, currentUsage: currentMonthlyInterviews, limit: limits.maxMonthlyInterviews }
    );
  }
  return true;
}

/**
 * Clamps requested question count per session according to the user's tier.
 * @param {number} requestedQuestions
 * @param {string} userTier
 * @returns {number}
 */
function clampQuestionsPerTier(requestedQuestions, userTier = TIERS.FREE) {
  const limits = getTierLimits(userTier);
  const requested = Number(requestedQuestions) || limits.maxQuestionsPerSession;
  if (requested > limits.maxQuestionsPerSession) {
    return limits.maxQuestionsPerSession;
  }
  return Math.max(3, requested);
}

/**
 * Validates whether the user can upload a resume based on monthly resume count.
 * @param {string} userTier
 * @param {number} currentMonthlyUploads
 * @returns {boolean}
 * @throws {ApiError}
 */
function assertResumeUploadQuota(userTier = TIERS.FREE, currentMonthlyUploads = 0) {
  const limits = getTierLimits(userTier);
  if (currentMonthlyUploads >= limits.maxMonthlyResumes) {
    throw new ApiError(
      403,
      `Monthly resume upload quota reached. Free tier allows ${limits.maxMonthlyResumes} uploads per month.`,
      "QUOTA_EXCEEDED",
      { tier: userTier, currentUsage: currentMonthlyUploads, limit: limits.maxMonthlyResumes }
    );
  }
  return true;
}

module.exports = {
  TIERS,
  TIER_LIMITS,
  getTierLimits,
  assertInterviewQuota,
  clampQuestionsPerTier,
  assertResumeUploadQuota,
};
