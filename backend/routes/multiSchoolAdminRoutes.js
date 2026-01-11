import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import {
  getDashboardStats,
  getSchoolAdmins,
  assignSchoolAdmin,
  removeSchoolAdmin,
  getAllSchoolAdmins,
  getSchoolDetails,
  createSchoolAdmin,
  updateSchoolAdmin,
  deleteSchoolAdmin,
} from '../controllers/multiSchoolAdminController.js';

const router = express.Router();

// Dashboard
router.get('/dashboard-stats', protect, authorize('MULTI_SCHOOL_ADMIN'), getDashboardStats);
router.get(
  '/schools/:schoolId/details',
  protect,
  authorize('MULTI_SCHOOL_ADMIN'),
  getSchoolDetails
);

// Admin Management
router.get('/admins', protect, authorize('MULTI_SCHOOL_ADMIN'), getAllSchoolAdmins);
router.post('/admins', protect, authorize('MULTI_SCHOOL_ADMIN'), createSchoolAdmin);
router.put('/admins/:adminId', protect, authorize('MULTI_SCHOOL_ADMIN'), updateSchoolAdmin);
router.delete('/admins/:adminId', protect, authorize('MULTI_SCHOOL_ADMIN'), deleteSchoolAdmin);

router.get('/:schoolId/admins', protect, authorize('MULTI_SCHOOL_ADMIN'), getSchoolAdmins);
router.post('/:schoolId/admins', protect, authorize('MULTI_SCHOOL_ADMIN'), assignSchoolAdmin);
router.delete(
  '/:schoolId/admins/:adminId',
  protect,
  authorize('MULTI_SCHOOL_ADMIN'),
  removeSchoolAdmin
);

export default router;
