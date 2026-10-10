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
};

const validateEnv = () => {
  const missingVariables = [];

  if (!env.DATABASE_URL) {
    missingVariables.push("DATABASE_URL");
  }

  if (!env.JWT_SECRET) {
    missingVariables.push("JWT_SECRET");
  }

  if (missingVariables.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVariables.join(", ")}`);
  }
};

module.exports = {
  env,
  validateEnv,
};
