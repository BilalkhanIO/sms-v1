const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  // Get token from header
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Check if token exists
  if (!token) {
    return next(new AppError('Not authorized to access this route', 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from token
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    // Check if user is active
    if (user.status !== 'ACTIVE') {
      return next(new AppError('User account is not active', 401));
    }

    req.user = user;
    next();
  } catch (err) {
    return next(new AppError('Not authorized to access this route', 401));
  }
});

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError(`Role ${req.user.role} is not authorized to access this route`, 403));
    }
    next();
  };
};

module.exports = { protect, authorize }; 