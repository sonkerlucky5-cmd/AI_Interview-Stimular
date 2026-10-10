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

  if (error.code === 11000) {
    return new ApiError(409, "A record with this value already exists.");
  }

  if (error.name === "CastError") {
    return new ApiError(400, `Invalid value for ${error.path}.`);
  }

  if (error.message === "Not allowed by CORS") {
    return new ApiError(403, "This origin is not allowed to access the API.");
  }

  return new ApiError(500, error.message || "Something went wrong on the server.");
};

const errorHandler = (error, _req, res, _next) => {
  const normalizedError = normalizeError(error);

  return res.status(normalizedError.statusCode || 500).json({
    success: false,
    message: normalizedError.message,
    ...(env.NODE_ENV === "development" && { stack: normalizedError.stack }),
  });
};

module.exports = {
  errorHandler,
  notFound,
};
