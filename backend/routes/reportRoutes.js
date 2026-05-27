import express from 'express';
import {
  getReportTypes,
  generateReport,
} from '../controllers/reportController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router
  .route('/types')
  .get(protect, authorize('SUPER_ADMIN'), getReportTypes);

router
  .route('/generate/:reportType')
  .post(protect, authorize('SUPER_ADMIN'), generateReport);

export default router;
