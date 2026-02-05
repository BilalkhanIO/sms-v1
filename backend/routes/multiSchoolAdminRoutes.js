import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { getDashboardStats, getSchoolAdmins, assignSchoolAdmin, removeSchoolAdmin, getSchoolDetails } from '../controllers/multiSchoolAdminController.js';

const router = express.Router();

router.get('/dashboard-stats', protect, authorize('MULTI_SCHOOL_ADMIN'), getDashboardStats);
router.get('/schools/:schoolId/details', protect, authorize('MULTI_SCHOOL_ADMIN'), getSchoolDetails);
router.get('/:schoolId/admins', protect, authorize('MULTI_SCHOOL_ADMIN'), getSchoolAdmins);
router.post('/:schoolId/admins', protect, authorize('MULTI_SCHOOL_ADMIN'), assignSchoolAdmin);
router.delete('/:schoolId/admins/:adminId', protect, authorize('MULTI_SCHOOL_ADMIN'), removeSchoolAdmin);

export default router;
