import express from 'express';
import {
  generateReport,
  getReports,
  getReportById,
  downloadReport,
  deleteReport,
} from '../controllers/reportController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Super Admin routes
router
  .route('/')
  .post(protect, authorize('SUPER_ADMIN'), generateReport)
  .get(protect, authorize('SUPER_ADMIN'), getReports);

router
  .route('/:id')
  .get(protect, authorize('SUPER_ADMIN'), getReportById)
  .delete(protect, authorize('SUPER_ADMIN'), deleteReport);

router.route('/:id/download').get(protect, authorize('SUPER_ADMIN'), downloadReport);

export default router;
