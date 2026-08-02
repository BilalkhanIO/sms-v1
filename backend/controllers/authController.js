import User from "../models/User.js";
import asyncHandler from "express-async-handler";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js";
import Activity from "../models/Activity.js";
import { body, validationResult } from "express-validator";
import crypto from "crypto";

const COOKIE_OPTS = (maxAge) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge,
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = [
  body("email").isEmail().withMessage("Invalid email address"),
  body("password").notEmpty().withMessage("Password is required"),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Validation failed", errors: errors.array() });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (user.status !== "ACTIVE") {
      return res.status(403).json({
        message: `Account is ${user.status}. Please contact support.`,
      });
    }

    await user.updateLastLogin();

    await Activity.create({
      user: user._id,
      type: "LOGIN",
      description: "User logged in",
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      context: "authentication",
    });

    const accessToken = generateAccessToken(user._id, user.role);
    const { token: refreshToken, hashedToken, expires } = generateRefreshToken();

    user.refreshToken = hashedToken;
    user.refreshTokenExpires = expires;
    await user.save({ validateBeforeSave: false });

    res.cookie("accessToken", accessToken, COOKIE_OPTS(15 * 60 * 1000)); // 15 min
    res.cookie("refreshToken", refreshToken, COOKIE_OPTS(7 * 24 * 60 * 60 * 1000)); // 7 days

    const sanitizedUser = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture,
      school: user.school,
    };

    return res.status(200).json({ data: sanitizedUser, message: "User logged in successfully" });
  }),
];

// @desc    Refresh access token using refresh token cookie
// @route   POST /api/auth/refresh-token
// @access  Public (cookie-based)
const refreshTokenHandler = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    return res.status(401).json({ message: "No refresh token provided" });
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    refreshToken: hashedToken,
    refreshTokenExpires: { $gt: Date.now() },
  }).select("+refreshToken +refreshTokenExpires");

  if (!user) {
    return res.status(401).json({ message: "Invalid or expired refresh token" });
  }

  if (user.status !== "ACTIVE") {
    return res.status(403).json({ message: "Account is not active" });
  }

  // Rotate refresh token on each use
  const { token: newRefreshToken, hashedToken: newHashedToken, expires } = generateRefreshToken();
  user.refreshToken = newHashedToken;
  user.refreshTokenExpires = expires;
  await user.save({ validateBeforeSave: false });

  const accessToken = generateAccessToken(user._id, user.role);

  res.cookie("accessToken", accessToken, COOKIE_OPTS(15 * 60 * 1000));
  res.cookie("refreshToken", newRefreshToken, COOKIE_OPTS(7 * 24 * 60 * 60 * 1000));

  return res.status(200).json({ message: "Token refreshed" });
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logoutUser = asyncHandler(async (req, res) => {
  await Activity.create({
    user: req.user._id,
    type: "LOGOUT",
    description: "User logged out",
    ip: req.ip,
    userAgent: req.headers["user-agent"],
    context: "authentication",
  });

  // Revoke refresh token in DB
  await User.findByIdAndUpdate(req.user._id, {
    refreshToken: null,
    refreshTokenExpires: null,
  });

  const cleared = { ...COOKIE_OPTS(0), expires: new Date(0) };
  res.cookie("accessToken", "", cleared);
  res.cookie("refreshToken", "", cleared);

  return res.status(200).json({ message: "Logged out successfully" });
});

// @desc    Forgot password — sends reset token via email
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = [
  body("email").isEmail().withMessage("Invalid email address"),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Validation failed", errors: errors.array() });
    }

    const { email } = req.body;
    const user = await User.findOne({ email });

    // Always return the same response to prevent user enumeration
    if (!user) {
      return res.status(200).json({
        message: "If an account with that email exists, a reset link has been sent.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save({ validateBeforeSave: false });

    // TODO: Send email with resetToken. Example reset URL:
    // `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`
    // For development, log it to the server console only — never expose in response
    if (process.env.NODE_ENV !== "production") {
      console.log(`[DEV] Password reset token for ${email}: ${resetToken}`);
    }

    return res.status(200).json({
      message: "If an account with that email exists, a reset link has been sent.",
    });
  }),
];

// @desc    Reset password with token
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = [
  body("token").notEmpty().withMessage("Reset token is required"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Validation failed", errors: errors.array() });
    }

    const { token, password } = req.body;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  }),
];

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.status(200).json({ data: user });
});

export { loginUser, logoutUser, refreshTokenHandler, forgotPassword, resetPassword, getMe };
