// controllers/activityController.js
import Activity from "../models/Activity.js";
import asyncHandler from "express-async-handler";
import { protect, authorize } from "../middleware/authMiddleware.js"; // Import auth middleware
import { successResponse, errorResponse } from "../utils/apiResponse.js";

// @desc    Get all activities
// @route   GET /api/activities
// @access  Private/Admin
const getActivities = [
  protect, // Protect the route, ensuring user is authenticated
  authorize("SUPER_ADMIN", "SCHOOL_ADMIN"), // Only admins can access
  asyncHandler(async (req, res) => {
    const { user, type, startDate, endDate, severity, context } = req.query;

    const filter = {};
    if (user) filter.user = user;
    if (type) filter.type = type;
    if (severity) filter.severity = severity;
    if (context) filter.context = context;

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const activities = await Activity.find(filter)
      .populate("user", "firstName lastName role") // Populate user for display
      .sort("-createdAt"); // Sort by creation date (newest first)

    return successResponse(
      res,
      activities,
      "Activities retrieved successfully"
    );
  }),
];
export { getActivities };
