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
router.route('/').post(createSchool).get(getSchools);
router.route('/:id').get(getSchoolById).put(updateSchool).delete(deleteSchool);

export default router;
