import express from 'express';
import {
  createSetting,
  getSettings,
  getSettingByName,
  updateSettingByName,
  deleteSettingByName,
} from '../controllers/settingController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Private routes (Super Admin only)
router.route('/').post(protect, authorize('SUPER_ADMIN'), createSetting).get(protect, authorize('SUPER_ADMIN'), getSettings);
router.route('/:settingName').get(protect, authorize('SUPER_ADMIN'), getSettingByName).put(protect, authorize('SUPER_ADMIN'), updateSettingByName).delete(protect, authorize('SUPER_ADMIN'), deleteSettingByName);

export default router;
