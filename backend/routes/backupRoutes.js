import express from 'express';
import {
  createBackup,
  getBackups,
  getBackupById,
  downloadBackup,
  deleteBackup,
  restoreBackup,
} from '../controllers/backupController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Super Admin routes
router
  .route('/')
  .post(protect, authorize('SUPER_ADMIN'), createBackup)
  .get(protect, authorize('SUPER_ADMIN'), getBackups);

router
  .route('/:id')
  .get(protect, authorize('SUPER_ADMIN'), getBackupById)
  .delete(protect, authorize('SUPER_ADMIN'), deleteBackup);

router.route('/:id/download').get(protect, authorize('SUPER_ADMIN'), downloadBackup);
router.route('/:id/restore').post(protect, authorize('SUPER_ADMIN'), restoreBackup);

export default router;
