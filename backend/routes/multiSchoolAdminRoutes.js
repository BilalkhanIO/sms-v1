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
  getManagedSchools,
  getAllManagedUsers,
} from '../controllers/multiSchoolAdminController.js';

const router = express.Router();

router.get('/dashboard-stats', protect, authorize('MULTI_SCHOOL_ADMIN'), getDashboardStats);
router.get('/:schoolId/admins', protect, authorize('MULTI_SCHOOL_ADMIN'), getSchoolAdmins);
router.post('/:schoolId/admins', protect, authorize('MULTI_SCHOOL_ADMIN'), assignSchoolAdmin);
router.delete('/:schoolId/admins/:adminId', protect, authorize('MULTI_SCHOOL_ADMIN'), removeSchoolAdmin);

router.get('/admins', protect, authorize('MULTI_SCHOOL_ADMIN'), getMultiSchoolAdmins);
router.post('/admins', protect, authorize('MULTI_SCHOOL_ADMIN'), assignMultiSchoolAdmin);
router.delete('/admins/:adminId', protect, authorize('MULTI_SCHOOL_ADMIN'), removeMultiSchoolAdmin);
router.get('/schools', protect, authorize('MULTI_SCHOOL_ADMIN'), getManagedSchools);
router.get('/users', protect, authorize('MULTI_SCHOOL_ADMIN'), getAllManagedUsers);

export default router;
