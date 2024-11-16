// authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  // Find user by email and include password field
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    return next(new AppError('Invalid credentials', 401));
  }

  // Generate JWT token
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );

  // Remove password from output
  user.password = undefined;

  res.status(200).json({
    success: true,
    token,
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      status: user.status,
      profilePicture: user.profilePicture
    },
    isAuthenticated: true
  });
});

exports.register = catchAsync(async (req, res, next) => {
  const { firstName, lastName, email, password, role } = req.body;

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return next(new AppError('Email already registered', 400));
  }

  // Create user
  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    role: role || 'STUDENT'
  });

  // Generate token
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );

  res.status(201).json({
    success: true,
    token,
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      status: user.status
    },
    isAuthenticated: true
  });
});

exports.getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      status: user.status,
      profilePicture: user.profilePicture
    },
    isAuthenticated: true
  });
});

exports.logout = catchAsync(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
    isAuthenticated: false
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  // Check current password
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new AppError('Current password is incorrect', 401));
  }

  user.password = req.body.newPassword;
  await user.save();

  // Generate new token
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );

  res.status(200).json({
    success: true,
    token,
    message: 'Password updated successfully'
  });
});
