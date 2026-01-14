import express from 'express';
import {
  createSchool,
  getSchools,
  getSchoolById,
  updateSchool,
  deleteSchool,
} from '../controllers/schoolController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { logActivity } from '../middleware/auditLogMiddleware.js';

const router = express.Router();

// Private routes (Super Admin only)
router
  .route('/')
  .post(protect, authorize('SUPER_ADMIN'), logActivity('SCHOOL_CREATE', 'School'), createSchool)
  .get(protect, authorize('SUPER_ADMIN'), getSchools);
router
  .route('/:id')
  .get(protect, authorize('SUPER_ADMIN'), getSchoolById)
  .put(protect, authorize('SUPER_ADMIN'), logActivity('SCHOOL_UPDATE', 'School'), updateSchool)
  .delete(protect, authorize('SUPER_ADMIN'), logActivity('SCHOOL_DELETE', 'School'), deleteSchool);

export default router;
