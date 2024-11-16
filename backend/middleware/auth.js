const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/appError');
const logger = require('../utils/logger');

const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('Not authorized to access this route', 401));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return next(new AppError('User not found', 404));
      }

      if (user.status !== 'ACTIVE') {
        return next(new AppError('User account is not active', 401));
      }

      req.user = user;
      next();
    } catch (error) {
      logger.error('Token verification failed:', error);
      return next(new AppError('Not authorized to access this route', 401));
    }
  } catch (error) {
    logger.error('Auth middleware error:', error);
    return next(new AppError('Authentication error', 500));
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError(`Role ${req.user.role} is not authorized to access this route`, 403));
    }
    next();
  };
};

module.exports = { protect, authorize }; 