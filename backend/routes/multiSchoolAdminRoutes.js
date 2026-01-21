import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import {
  getDashboardStats,
  getSchoolAdmins,
  assignSchoolAdmin,
  removeSchoolAdmin,
  getMultiSchoolAdmins,
  assignMultiSchoolAdmin,
  removeMultiSchoolAdmin
} from '../controllers/multiSchoolAdminController.js';

const router = express.Router();

router.route('/admins')
  .get(protect, authorize('MULTI_SCHOOL_ADMIN'), getMultiSchoolAdmins)
  .post(protect, authorize('MULTI_SCHOOL_ADMIN'), assignMultiSchoolAdmin);

router.route('/admins/:adminId')
  .delete(protect, authorize('MULTI_SCHOOL_ADMIN'), removeMultiSchoolAdmin);

router.get('/dashboard-stats', protect, authorize('MULTI_SCHOOL_ADMIN'), getDashboardStats);
router.get('/:schoolId/admins', protect, authorize('MULTI_SCHOOL_ADMIN'), getSchoolAdmins);
router.post('/:schoolId/admins', protect, authorize('MULTI_SCHOOL_ADMIN'), assignSchoolAdmin);
router.delete('/:schoolId/admins/:adminId', protect, authorize('MULTI_SCHOOL_ADMIN'), removeSchoolAdmin);

export default router;
