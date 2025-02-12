// controllers/activityController.js
import Activity from '../models/Activity.js';
import asyncHandler from 'express-async-handler';

// @desc    Get all activities
// @route   GET /api/activities
// @access  Private/Admin
const getActivities = asyncHandler(async (req, res) => {
  const { user, type, startDate, endDate, severity } = req.query;
  
  const filter = {};
  if (user) filter.user = user;
  if (type) filter.type = type;
  if (severity) filter.severity = severity;
  
  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate);
    if (endDate) filter.createdAt.$lte = new Date(endDate);
  }

  const activities = await Activity.find(filter)
    .populate('user', 'firstName lastName role')
    .sort('-createdAt');

  res.json(activities.map(activity => activity.toDisplay()));
});

export { getActivities };

