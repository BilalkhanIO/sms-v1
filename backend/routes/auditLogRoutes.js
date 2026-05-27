import express from 'express';
import { getAuditLogs } from '../controllers/auditLogController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Routes for audit logs
// @access  Private/SuperAdmin
router
  .route('/')
  .get(protect, authorize('SUPER_ADMIN'), getAuditLogs);

export default router;
