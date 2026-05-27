import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import {
  getDashboardStats,
  getSchoolAdmins,
  assignSchoolAdmin,
  removeSchoolAdmin,
  getMultiSchoolAdmins,
  assignMultiSchoolAdmin,
  removeMultiSchoolAdmin,
  getSchoolDetails,
} from '../controllers/multiSchoolAdminController.js';

const router = express.Router();

// School-specific admin routes
router.get('/dashboard-stats', protect, authorize('MULTI_SCHOOL_ADMIN'), getDashboardStats);
router.get('/:schoolId/admins', protect, authorize('MULTI_SCHOOL_ADMIN'), getSchoolAdmins);
router.post('/:schoolId/admins', protect, authorize('MULTI_SCHOOL_ADMIN'), assignSchoolAdmin);
router.delete('/:schoolId/admins/:adminId', protect, authorize('MULTI_SCHOOL_ADMIN'), removeSchoolAdmin);

// Multi-school system admin routes
router.get('/admins', protect, authorize('MULTI_SCHOOL_ADMIN'), getMultiSchoolAdmins);
router.post('/admins', protect, authorize('MULTI_SCHOOL_ADMIN'), assignMultiSchoolAdmin);
router.delete('/admins/:adminId', protect, authorize('MULTI_SCHOOL_ADMIN'), removeMultiSchoolAdmin);

// School details route
router.get('/schools/:schoolId/details', protect, authorize('MULTI_SCHOOL_ADMIN'), getSchoolDetails);

export default router;
