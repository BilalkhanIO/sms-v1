import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import {
  getDashboardStats,
  getSchoolAdmins,
  assignSchoolAdmin,
  removeSchoolAdmin,
  getManagedSchools,
  getAllManagedUsers,
  getMultiSchoolAdmins,
  assignMultiSchoolAdmin,
  removeMultiSchoolAdmin,
} from '../controllers/multiSchoolAdminController.js';

const router = express.Router();

router.get('/dashboard-stats', protect, authorize('MULTI_SCHOOL_ADMIN'), getDashboardStats);

router.get('/schools', protect, authorize('MULTI_SCHOOL_ADMIN'), getManagedSchools);
router.get('/users', protect, authorize('MULTI_SCHOOL_ADMIN'), getAllManagedUsers);

router.get('/:schoolId/admins', protect, authorize('MULTI_SCHOOL_ADMIN'), getSchoolAdmins);
router.post('/:schoolId/admins', protect, authorize('MULTI_SCHOOL_ADMIN'), assignSchoolAdmin);
router.delete(
  '/:schoolId/admins/:adminId',
  protect,
  authorize('MULTI_SCHOOL_ADMIN'),
  removeSchoolAdmin
);

router.get('/admins', protect, authorize('MULTI_SCHOOL_ADMIN'), getMultiSchoolAdmins);
router.post('/admins', protect, authorize('MULTI_SCHOOL_ADMIN'), assignMultiSchoolAdmin);
router.delete(
  '/admins/:userId',
  protect,
  authorize('MULTI_SCHOOL_ADMIN'),
  removeMultiSchoolAdmin
);

export default router;
