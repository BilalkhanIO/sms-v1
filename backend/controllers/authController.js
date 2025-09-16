import User from "../models/User.js";
import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import Activity from "../models/Activity.js";
import { body, validationResult } from "express-validator";
import crypto from "crypto";

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = [
  body("email").isEmail().withMessage("Invalid email address"),
  body("password").notEmpty().withMessage("Password is required"),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: "Validation failed", errors: errors.array() });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (user && (await user.matchPassword(password))) {
      if (user.status !== "ACTIVE") {
        return res
          .status(403)
          .json({
            message: `Account is ${user.status}. Please contact support.`,
          });
      }

      await user.updateLastLogin();

      await Activity.logActivity({
        userId: user._id,
        type: "LOGIN",
        description: "User logged in",
        ip: req.ip,
        userAgent: req.headers["user-agent"],
        context: "authentication",
      });

      const token = generateToken(user._id, user.role);

      res.cookie("accessToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });

      const sanitizedUser = {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
      };

      return res
        .status(200)
        .json({ data: sanitizedUser, message: "User logged in successfully" });
    } else {
      return res.status(401).json({ message: "Invalid email or password" });
    }
  }),
];

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logoutUser = asyncHandler(async (req, res) => {
  await Activity.logActivity({
    userId: req.user._id,
    type: "LOGOUT",
    description: "User logged out",
    ip: req.ip,
    userAgent: req.headers["user-agent"],
    context: "authentication",
  });

  res.cookie("accessToken", "", {
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return res.status(200).json({ message: "Logged out successfully" });
});

// @desc    Forgot password - Generate reset token
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = [
  body("email").isEmail().withMessage("Invalid email address"),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: "Validation failed", errors: errors.array() });
    }

    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User with this email does not exist" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // In a real app, send this token via email. For now, return it in response for testing.
    res.status(200).json({ message: "Reset token generated", resetToken });
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
      return res
        .status(400)
        .json({ message: "Validation failed", errors: errors.array() });
    }

    const { token, password } = req.body;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    user.password = password; // Will be hashed by pre-save hook
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  }),
];

export { loginUser, logoutUser, forgotPassword, resetPassword };
