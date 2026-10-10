const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { clearAuthCookie, sendAuthResponse } = require("../services/tokenService");

const signup = catchAsync(async (req, res) => {
  const { name = "", email = "", password = "" } = req.body;

  if (!name.trim() || !email.trim() || !password || password.trim().length === 0) {
    throw new ApiError(400, "Name, email, and password are required.");
  }

  if (password.length < 8) {
    throw new ApiError(400, "Password must be at least 8 characters long.");
  }

  const normalizedEmail = email.toLowerCase().trim();
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    throw new ApiError(409, "An account with this email already exists.");
  }

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password,
  });

  return sendAuthResponse(res, 201, "Account created successfully.", user);
});

const login = catchAsync(async (req, res) => {
  const { email = "", password = "" } = req.body;

  if (!email.trim() || !password || password.trim().length === 0) {
    throw new ApiError(400, "Email and password are required.");
  }

  const normalizedEmail = email.toLowerCase().trim();
  const user = await User.findOne({ email: normalizedEmail }).select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password.");
  }

  return sendAuthResponse(res, 200, "Login successful.", user);
});

const getProfile = catchAsync(async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Profile fetched successfully.",
    data: {
      user: req.user.toSafeObject(),
    },
  });
});

const logout = catchAsync(async (_req, res) => {
  clearAuthCookie(res);

  return res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
});

module.exports = {
  getProfile,
  login,
  logout,
  signup,
};
