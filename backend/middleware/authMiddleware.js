// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import { errorResponse } from '../utils/apiResponse.js';

// Protect routes
export const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return errorResponse(res, 'Not authorized - no token', 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user || user.status !== 'ACTIVE') {
        return errorResponse(res, 'User account inactive or not found', 401);

    }

    req.user = user; // Attach user to the request
    next();
  } catch (error) {
      return errorResponse(res, 'Not authorized - token failed', 401);

  }
});

// Authorize access based on roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
        return errorResponse(res, `Access denied. Role ${req.user?.role || 'UNKNOWN'} not authorized.`, 403);
    }
    next();
  };
};