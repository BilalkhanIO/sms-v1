import express from 'express';
import {
  createSchool,
  getSchools,
  getSchoolById,
  updateSchool,
  deleteSchool,
} from '../controllers/schoolController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Private routes (Super Admin only)
router
  .route('/')
  .post(protect, authorize('SUPER_ADMIN'), createSchool)
  .get(protect, authorize('SUPER_ADMIN'), getSchools);
router
  .route('/:id')
  .get(protect, authorize('SUPER_ADMIN'), getSchoolById)
  .put(protect, authorize('SUPER_ADMIN'), updateSchool)
  .delete(protect, authorize('SUPER_ADMIN'), deleteSchool);

export default router;
