import asyncHandler from 'express-async-handler';
import AuditLog from '../models/AuditLog.js';

// @desc    Get all audit logs
// @route   GET /api/audit-logs
// @access  Private/SuperAdmin
export const getAuditLogs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, user, action, entity, startDate, endDate, sortBy = 'createdAt', sortOrder = 'desc', search } = req.query;

  const query = {};

  if (user) query.user = user;
  if (action) query.action = action;
  if (entity) query.entity = entity;
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }
   if (search) {
    query.$or = [
      { details: { $regex: search, $options: 'i' } },
      { 'user.firstName': { $regex: search, $options: 'i' } },
      { 'user.lastName': { $regex: search, $options: 'i' } },
      { 'user.email': { $regex: search, $options: 'i' } },
    ];
  }

  const logs = await AuditLog.find(query)
    .populate('user', 'firstName lastName email')
    .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const total = await AuditLog.countDocuments(query);

  res.json({
    data: logs,
    page: parseInt(page),
    pages: Math.ceil(total / limit),
    total,
  });
});
