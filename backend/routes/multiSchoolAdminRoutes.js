import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import {
  getDashboardStats,
  getSchoolAdmins,
  assignSchoolAdmin,
  removeSchoolAdmin,
  listMultiSchoolAdmins,
  assignMultiSchoolAdmin,
  removeMultiSchoolAdmin
} from '../controllers/multiSchoolAdminController.js';

const router = express.Router();

// Dashboard stats
router.get('/dashboard-stats', protect, authorize('MULTI_SCHOOL_ADMIN'), getDashboardStats);

// System-level multi-school admins
router.get('/admins', protect, authorize('SUPER_ADMIN', 'MULTI_SCHOOL_ADMIN'), listMultiSchoolAdmins);
router.post('/admins', protect, authorize('SUPER_ADMIN', 'MULTI_SCHOOL_ADMIN'), assignMultiSchoolAdmin);
router.delete('/admins/:adminId', protect, authorize('SUPER_ADMIN', 'MULTI_SCHOOL_ADMIN'), removeMultiSchoolAdmin);

// School-specific admins
router.get('/:schoolId/admins', protect, authorize('MULTI_SCHOOL_ADMIN'), getSchoolAdmins);
router.post('/:schoolId/admins', protect, authorize('MULTI_SCHOOL_ADMIN'), assignSchoolAdmin);
router.delete('/:schoolId/admins/:adminId', protect, authorize('MULTI_SCHOOL_ADMIN'), removeSchoolAdmin);


export default router;
