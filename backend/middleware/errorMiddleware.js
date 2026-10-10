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

const errorHandler = (error, req, res, _next) => {
  const normalizedError = normalizeError(error);

  return res.status(normalizedError.statusCode || 500).json({
    success: false,
    message: normalizedError.message,
    error: {
      code: normalizedError.code || `ERR_${normalizedError.statusCode || 500}`,
      message: normalizedError.message,
      requestId: req?.id || null,
    },
    ...(env.NODE_ENV === "development" && { stack: normalizedError.stack }),
  });
};

module.exports = {
  errorHandler,
  notFound,
};
