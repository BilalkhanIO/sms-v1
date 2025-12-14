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
router.route('/').post(createSetting).get(getSettings);
router.route('/:settingName').get(getSettingByName).put(updateSettingByName).delete(deleteSettingByName);

export default router;
