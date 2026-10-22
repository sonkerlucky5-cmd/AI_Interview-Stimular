const dotenv = require("dotenv");

dotenv.config();

const parseOrigins = (value) =>
  value
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT) || 5000,
  DATABASE_URL: process.env.DATABASE_URL || "",
  JWT_SECRET: process.env.JWT_SECRET || "",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  COOKIE_NAME: process.env.COOKIE_NAME || "rais_token",
  COOKIE_MAX_AGE_MS: Number(process.env.COOKIE_MAX_AGE_MS) || 1000 * 60 * 60 * 24 * 7,
  CLIENT_URLS: parseOrigins(process.env.CLIENT_URLS || process.env.CLIENT_URL || "http://localhost:5173"),
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || "",
  DSA_EXECUTION_ENABLED: process.env.DSA_EXECUTION_ENABLED === "true",
  DSA_SECURITY_REVIEW_APPROVED: process.env.DSA_SECURITY_REVIEW_APPROVED === "true",
  JUDGE0_API_URL: process.env.JUDGE0_API_URL || "",
  JUDGE0_API_KEY: process.env.JUDGE0_API_KEY || "",
};

const validateEnv = () => {
  const missingVariables = [];

  if (!process.env.NODE_ENV) {
    missingVariables.push("NODE_ENV");
  }

  if (!env.DATABASE_URL) {
    missingVariables.push("DATABASE_URL");
  }

  if (!env.JWT_SECRET) {
    missingVariables.push("JWT_SECRET");
  }

  if (missingVariables.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVariables.join(", ")}`);
  }

  if (!["development", "test", "production"].includes(env.NODE_ENV)) {
    throw new Error("NODE_ENV must be development, test, or production.");
  }

  if (env.NODE_ENV === "production") {
    const configuredOrigins = process.env.CLIENT_URLS || process.env.CLIENT_URL;
    if (!configuredOrigins) {
      throw new Error("Production configuration requires CLIENT_URLS with HTTPS origins.");
    }

    const origins = parseOrigins(configuredOrigins);
    const hasInvalidOrigin = origins.length === 0 || origins.some((origin) => {
      try {
        const parsed = new URL(origin);
        const hostname = parsed.hostname.toLowerCase().replace(/^\[|\]$/g, "");
        const isLoopback = hostname === "localhost" || hostname.endsWith(".localhost") || hostname === "::1" || /^127\./.test(hostname);
        return parsed.protocol !== "https:" || parsed.origin !== origin || isLoopback;
      } catch {
        return true;
      }
    });
    if (hasInvalidOrigin) {
      throw new Error("Production CLIENT_URLS must contain only valid HTTPS origins.");
    }

    if (!Number.isInteger(env.PORT) || env.PORT < 1 || env.PORT > 65535) {
      throw new Error("Production PORT must be an integer between 1 and 65535.");
    }
  }
};

module.exports = {
  env,
  validateEnv,
};
