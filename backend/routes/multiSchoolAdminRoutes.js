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
} from '../controllers/multiSchoolAdminController.js';

const router = express.Router();

router.get('/dashboard-stats', protect, authorize('MULTI_SCHOOL_ADMIN'), getDashboardStats);

// Multi-School System Admin Management
router.get('/admins', protect, authorize('MULTI_SCHOOL_ADMIN'), getMultiSchoolAdmins);
router.post('/admins', protect, authorize('MULTI_SCHOOL_ADMIN'), assignMultiSchoolAdmin);
router.delete('/admins/:adminId', protect, authorize('MULTI_SCHOOL_ADMIN'), removeMultiSchoolAdmin);

// School Admin Management for a specific school
router.get('/:schoolId/admins', protect, authorize('MULTI_SCHOOL_ADMIN'), getSchoolAdmins);
router.post('/:schoolId/admins', protect, authorize('MULTI_SCHOOL_ADMIN'), assignSchoolAdmin);
router.delete('/:schoolId/admins/:adminId', protect, authorize('MULTI_SCHOOL_ADMIN'), removeSchoolAdmin);


export default router;
