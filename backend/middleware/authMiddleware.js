const jwt = require("jsonwebtoken");
const { env } = require("../config/env");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");

const extractToken = (req) => {
  if (req.cookies?.[env.COOKIE_NAME]) {
    return req.cookies[env.COOKIE_NAME];
  }

  const authorizationHeader = req.headers.authorization || "";

  if (authorizationHeader.startsWith("Bearer ")) {
    return authorizationHeader.slice(7);
  }

  if (req.query?.token) {
    return req.query.token;
  }

  return null;
};

const protect = catchAsync(async (req, _res, next) => {
  const token = extractToken(req);

  if (!token) {
    throw new ApiError(401, "Authentication required.");
  }

  let decodedToken;

  try {
    decodedToken = jwt.verify(token, env.JWT_SECRET);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new ApiError(401, "Session expired. Please log in again.");
    }

    throw new ApiError(401, "Invalid authentication token.");
  }

  const user = await User.findById(decodedToken.sub);

  if (!user) {
    throw new ApiError(401, "The user for this token no longer exists.");
  }

  req.user = user;
  next();
});

module.exports = {
  protect,
};
