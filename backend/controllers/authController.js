// controllers/authController.js
import User from "../models/User.js";
import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import Activity from "../models/Activity.js";
import { body, validationResult } from "express-validator";
import { successResponse, errorResponse } from "../utils/apiResponse.js";
import { protect } from "../middleware/authMiddleware.js";

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = [
  // Validation rules
  body("email").isEmail().withMessage("Invalid email address"),
  body("password").notEmpty().withMessage("Password is required"),

  asyncHandler(async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, "Validation failed", 400, errors.array());
    }

    const { email, password } = req.body;

    // Find user by email and include the password (for authentication)
    const user = await User.findOne({ email }).select("+password");

    // Check if user exists and password matches
    if (user && (await user.matchPassword(password))) {
      // Check if user status is active
      if (user.status !== "ACTIVE") {
        return errorResponse(
          res,
          `Account is ${user.status}. Please contact support.`,
          403
        );
      }

      await user.updateLastLogin();

      // Log login activity
      await Activity.logActivity({
        userId: user._id,
        type: "LOGIN",
        description: "User logged in",
        ip: req.ip,
        userAgent: req.headers["user-agent"],
        context: "authentication",
      });

      const token = generateToken(user._id, user.role);

      // Set JWT as an HTTP-Only cookie
      res.cookie("accessToken", token, {
        httpOnly: true, // Makes the cookie inaccessible to client-side JavaScript
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        sameSite: "strict", // Mitigates CSRF attacks
        maxAge: 30 * 24 * 60 * 60 * 1000, // Cookie expiration (30 days)
      });

      // Return user data (excluding password)
      const sanitizedUser = {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
      };
      return successResponse(
        res,
        { data: sanitizedUser },
        " User login successfully"
      );
    } else {
      return errorResponse(res, "Invalid email or password", 401);
    }
  }),
];

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logoutUser = [
  protect, // Apply protect middleware to ensure user is authenticated
  asyncHandler(async (req, res) => {
    // Log logout activity
    await Activity.logActivity({
      userId: req.user._id, // Use req.user.id to get the logged-in user's ID
      type: "LOGOUT",
      description: "User logged out",
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      context: "authentication",
    });

    // Clear the accessToken cookie
    res.cookie("accessToken", "", {
      httpOnly: true,
      expires: new Date(0), // Set expiration to a past date to delete the cookie
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return successResponse(res, null, "Logged out successfully");
  }),
];

export { loginUser, logoutUser };
