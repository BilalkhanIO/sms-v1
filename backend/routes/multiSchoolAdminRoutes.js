import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import {
  getDashboardStats,
  getSchoolAdmins,
  assignSchoolAdmin,
  removeSchoolAdmin,
  getManagedUsers,
  createManagedUser,
  updateManagedUser,
  deleteManagedUser
} from '../controllers/multiSchoolAdminController.js';

const router = express.Router();

router.get('/dashboard-stats', protect, authorize('MULTI_SCHOOL_ADMIN'), getDashboardStats);
router.get('/:schoolId/admins', protect, authorize('MULTI_SCHOOL_ADMIN'), getSchoolAdmins);
router.post('/:schoolId/admins', protect, authorize('MULTI_SCHOOL_ADMIN'), assignSchoolAdmin);
router.delete('/:schoolId/admins/:adminId', protect, authorize('MULTI_SCHOOL_ADMIN'), removeSchoolAdmin);

// User management routes
router.route('/users')
  .get(protect, authorize('MULTI_SCHOOL_ADMIN'), getManagedUsers)
  .post(protect, authorize('MULTI_SCHOOL_ADMIN'), createManagedUser);

router.route('/users/:id')
  .put(protect, authorize('MULTI_SCHOOL_ADMIN'), updateManagedUser)
  .delete(protect, authorize('MULTI_SCHOOL_ADMIN'), deleteManagedUser);

export default router;
