import express from 'express';
import {
  getBackups,
  createBackup,
  restoreBackup,
  deleteBackup,
} from '../controllers/backupController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router
  .route('/')
  .get(protect, authorize('SUPER_ADMIN'), getBackups)
  .post(protect, authorize('SUPER_ADMIN'), createBackup);

router
  .route('/:id')
  .delete(protect, authorize('SUPER_ADMIN'), deleteBackup);

router
  .route('/:id/restore')
  .post(protect, authorize('SUPER_ADMIN'), restoreBackup);

export default router;
