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
    const user = await User.findById(decoded.userId).select('-password').populate('school');

    if (!user || user.status !== 'ACTIVE') {
        return errorResponse(res, 'User account inactive or not found', 401);

    }

    // Attach user to the request
    req.user = user;

    // If the user has a school associated (e.g., SCHOOL_ADMIN, TEACHER, STUDENT, PARENT)
    // and it's populated, attach its _id to req.user for easy access in controllers.
    if (user.school && user.school._id) {
      req.user.schoolId = user.school._id;
    }
    
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