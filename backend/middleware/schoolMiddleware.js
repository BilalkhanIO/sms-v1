import asyncHandler from 'express-async-handler';
import { errorResponse } from '../utils/apiResponse.js';

// Middleware to attach school ID for school-specific routes
const setSchoolId = asyncHandler(async (req, res, next) => {
  if (req.user.role === "SUPER_ADMIN") {
    // SUPER_ADMIN can optionally pass a schoolId in the query/body to scope their actions
    req.schoolId = req.query.schoolId || req.body.schoolId || null;
  } else if (req.user.role === "MULTI_SCHOOL_ADMIN") {
    const schoolId = req.query.schoolId || req.body.schoolId;
    if (schoolId) {
      if (!req.user.managedSchools.includes(schoolId)) {
        return errorResponse(
          res,
          "You are not authorized to manage this school.",
          403
        );
      }
      req.schoolId = schoolId;
    } else {
      // If no schoolId is provided, we can't scope the request.
      // or return an error. For now, we'll set it to null and let controllers handle it.
      return errorResponse(res, "School ID is required for this action.", 400);
    }
  } else if (
    req.user.role === "SCHOOL_ADMIN" ||
    req.user.role === "TEACHER" ||
    req.user.role === "STUDENT" ||
    req.user.role === "PARENT"
  ) {
    // Other roles are always scoped to their own school
    if (!req.user.school) {
      return errorResponse(res, "User is not associated with a school.", 403);
    }
    req.schoolId = req.user.school;
  }
  next();
});

// A simple middleware to check if a route should be tenanted
const isTenanted = asyncHandler(async (req, res, next) => {
  if (
    req.user.role !== "SUPER_ADMIN" &&
    req.user.role !== "MULTI_SCHOOL_ADMIN" &&
    !req.user.school
  ) {
    return errorResponse(res, "This resource requires a school context.", 403);
  }
  next();
});

export { setSchoolId, isTenanted };
