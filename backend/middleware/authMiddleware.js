const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization?.startsWith('Bearer') &&
    req.headers.authorization.split(' ')[1]
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new AppError('Please authenticate', 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256']
    });

    const user = await User.findById(decoded.userId)
      .select('-password')
      .select('+passwordChangedAt');

    if (!user) {
      throw new AppError('User no longer exists', 401);
    }

    if (user.passwordChangedAt) {
      const changedTimestamp = parseInt(user.passwordChangedAt.getTime() / 1000, 10);
      if (decoded.iat < changedTimestamp) {
        throw new AppError('Password recently changed. Please login again', 401);
      }
    }

    if (user.status !== 'ACTIVE') {
      throw new AppError('Account is inactive', 403);
    }

    req.user = user;
    next();
  } catch (error) {
    throw new AppError('Invalid token', 401);
  }
});

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new AppError(
        `User role ${req.user.role} is not authorized to access this route`,
        403
      );
    }
    next();
  };
};