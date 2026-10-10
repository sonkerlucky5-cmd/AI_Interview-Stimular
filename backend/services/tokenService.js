const jwt = require("jsonwebtoken");
const { env } = require("../config/env");

const generateToken = (userId) =>
  jwt.sign({ sub: userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });

const buildCookieOptions = () => ({
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: env.COOKIE_MAX_AGE_MS,
  path: "/",
});

const sendAuthResponse = (res, statusCode, message, user) => {
  const userId = (user.id || user._id || user).toString();
  const token = generateToken(userId);

  res.cookie(env.COOKIE_NAME, token, buildCookieOptions());

  return res.status(statusCode).json({
    success: true,
    message,
    data: {
      user: typeof user.toSafeObject === "function" ? user.toSafeObject() : user,
    },
  });
};

const clearAuthCookie = (res) => {
  res.clearCookie(env.COOKIE_NAME, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
  });
};

module.exports = {
  buildCookieOptions,
  clearAuthCookie,
  generateToken,
  sendAuthResponse,
};
