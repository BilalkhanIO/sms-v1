// controllers/authController.js
import User from '../models/User.js';
import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js';
import Activity from '../models/Activity.js';

// @desc    Authenticate user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if (user && (await user.matchPassword(password))) {
    user.lastLogin = new Date();
    await user.save();

    // Log login activity
    await Activity.logActivity({
      userId: user._id,
      type: 'LOGIN',
      description: 'User logged in',
      ip: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  } else {
    res.status(401);
    throw new Error('Invalid credentials');
  }
});

// @desc    Logout user
// @route   POST /api/users/logout
// @access  Private
const logoutUser = asyncHandler(async (req, res) => {
  // Log logout activity
  await Activity.logActivity({
    userId: req.user.id,
    type: 'LOGOUT',
    description: 'User logged out',
    ip: req.ip,
    userAgent: req.headers['user-agent']
  });

  res.json({ message: 'Logged out successfully' });
});

export { loginUser, logoutUser };