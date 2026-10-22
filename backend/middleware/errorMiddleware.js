const { env } = require("../config/env");
const ApiError = require("../utils/ApiError");

const notFound = (req, _res, next) => {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
};

const normalizeError = (error) => {
  if (error instanceof ApiError) {
    return error;
  }

  if (error.name === "ValidationError") {
    const validationMessage = Object.values(error.errors)
      .map((item) => item.message)
      .join(" ");

    return new ApiError(400, validationMessage || "Validation failed.");
  }

  if (error.code === "23505" || error.code === 11000) {
    return new ApiError(409, "An account with this email already exists.");
  }

  if (error.code === "22P02" || error.name === "CastError") {
    return new ApiError(400, "Invalid identifier format.");
  }

  if (error.code === "23502") {
    return new ApiError(400, `Required field missing: ${error.column || "field"}.`);
  }

  if (error.message === "Not allowed by CORS") {
    return new ApiError(403, "This origin is not allowed to access the API.");
  }

  return new ApiError(500, error.message || "Something went wrong on the server.");
};

const redactLogDetails = (value) => String(value || "")
  .replace(/(password|token|secret|api[_-]?key|authorization)(\s*[:=]\s*)[^\s&]+/gi, "$1$2[REDACTED]")
  .replace(/(Bearer\s+)[A-Za-z0-9._~-]+/gi, "$1[REDACTED]")
  .replace(/(postgres(?:ql)?:\/\/[^:/@]+:)[^@]+@/gi, "$1[REDACTED]@");

const errorHandler = (error, req, res, _next) => {
  const normalizedError = normalizeError(error);
  const statusCode = normalizedError.statusCode || 500;
  const isInternalError = statusCode >= 500;
  const publicMessage = isInternalError && env.NODE_ENV === "production"
    ? "Internal server error."
    : normalizedError.message;

  if (isInternalError) {
    const details = error?.stack || error?.message || "Unknown server error";
    console.error(`[${req?.id || "no-request-id"}] ${redactLogDetails(details)}`);
  }

  return res.status(statusCode).json({
    success: false,
    message: publicMessage,
    error: {
      code: isInternalError && env.NODE_ENV === "production"
        ? "INTERNAL_SERVER_ERROR"
        : normalizedError.code || `ERR_${normalizedError.statusCode || 500}`,
      message: publicMessage,
      requestId: req?.id || null,
    },
    ...(env.NODE_ENV === "development" && !isInternalError && { stack: normalizedError.stack }),
  });
};

module.exports = {
  errorHandler,
  notFound,
};
