// controllers/userController.js
import User from "../models/User.js";
import asyncHandler from "express-async-handler";
import Activity from "../models/Activity.js";

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  user.firstName = req.body.firstName || user.firstName;
  user.lastName = req.body.lastName || user.lastName;
  user.profilePicture = req.body.profilePicture || user.profilePicture;

  if (req.body.password) {
    user.password = req.body.password;
  }

  const updatedUser = await user.save();

  await Activity.logActivity({
    userId: user._id,
    type: "PROFILE_UPDATED",
    description: "Updated profile information",
    ip: req.ip,
    userAgent: req.headers["user-agent"],
  });

  res.json({
    _id: updatedUser._id,
    firstName: updatedUser.firstName,
    lastName: updatedUser.lastName,
    email: updatedUser.email,
    role: updatedUser.role,
  });
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)
    .select("-password")
    .populate("student teacher");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.json(user);
});

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const { role, status } = req.query;
  const filter = {};
  if (role) filter.role = role;
  if (status) filter.status = status;

  const users = await User.find(filter)
    .select("-password")
    .populate("student teacher")
    .sort("-createdAt");

  res.json(users);
});

// @desc    Update user role (Admin only)
// @route   PUT /api/users/:id/role
// @access  Private/Admin
const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.role = role;
  await user.save();

  await Activity.logActivity({
    userId: req.user.id,
    type: "SYSTEM",
    description: `Updated user role to ${role}`,
    metadata: { userId: user._id },
    ip: req.ip,
    userAgent: req.headers["user-agent"],
  });

  res.json(user);
});
const createUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;

  // Check if a user with the same email already exists.
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error("User already exists with this email");
  }

  // Create the user with default role and status.
  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    role: role || "STUDENT",
    status: "ACTIVE"
  });

  // Log the user creation as an activity.
  await Activity.logActivity({
    user: user._id,
    type: "USER_CREATED",
    description: "User account created",
    metadata: { userId: user._id },
    ip: req.ip,
    userAgent: req.headers["user-agent"]
  });

  res.status(201).json({
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    status: user.status
  });
});

export { updateProfile, getProfile, getUsers, updateUserRole, createUser};
