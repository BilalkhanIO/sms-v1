import Setting from '../models/Setting.js';
import asyncHandler from 'express-async-handler';
import { body, validationResult } from 'express-validator';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import Activity from '../models/Activity.js';

// @desc    Create a new setting
// @route   POST /api/settings
// @access  Private/SuperAdmin
const createSetting = [
  protect,
  authorize('SUPER_ADMIN'),
  body('settingName').notEmpty().withMessage('Setting name is required'),
  body('settingValue').notEmpty().withMessage('Setting value is required'),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Validation failed', 400, errors.array());
    }

    const { settingName, settingValue, description } = req.body;

    const settingExists = await Setting.findOne({ settingName });
    if (settingExists) {
      return errorResponse(res, 'Setting with this name already exists', 400);
    }

    const setting = await Setting.create({ settingName, settingValue, description });

    await Activity.logActivity({
      userId: req.user._id,
      type: 'SETTING_CREATED',
      description: `Created setting: ${settingName}`,
      context: 'system-settings',
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return successResponse(res, setting, 'Setting created successfully', 201);
  }),
];

// @desc    Get all settings
// @route   GET /api/settings
// @access  Private/SuperAdmin
const getSettings = [
  protect,
  authorize('SUPER_ADMIN'),
  asyncHandler(async (req, res) => {
    const settings = await Setting.find({});
    return successResponse(res, settings, 'Settings retrieved successfully');
  }),
];

// @desc    Get setting by name
// @route   GET /api/settings/:settingName
// @access  Private/SuperAdmin
const getSettingByName = [
  protect,
  authorize('SUPER_ADMIN'),
  asyncHandler(async (req, res) => {
    const setting = await Setting.findOne({ settingName: req.params.settingName });
    if (!setting) {
      return errorResponse(res, 'Setting not found', 404);
    }
    return successResponse(res, setting, 'Setting retrieved successfully');
  }),
];

// @desc    Update a setting by name
// @route   PUT /api/settings/:settingName
// @access  Private/SuperAdmin
const updateSettingByName = [
  protect,
  authorize('SUPER_ADMIN'),
  body('settingValue').notEmpty().withMessage('Setting value is required'),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Validation failed', 400, errors.array());
    }

    const { settingValue, description } = req.body;
    const setting = await Setting.findOne({ settingName: req.params.settingName });

    if (!setting) {
      return errorResponse(res, 'Setting not found', 404);
    }

    setting.settingValue = settingValue;
    if (description !== undefined) {
        setting.description = description;
    }
    const updatedSetting = await setting.save();

    await Activity.logActivity({
      userId: req.user._id,
      type: 'SETTING_UPDATED',
      description: `Updated setting: ${updatedSetting.settingName}`,
      context: 'system-settings',
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return successResponse(res, updatedSetting, 'Setting updated successfully');
  }),
];

// @desc    Delete a setting by name
// @route   DELETE /api/settings/:settingName
// @access  Private/SuperAdmin
const deleteSettingByName = [
  protect,
  authorize('SUPER_ADMIN'),
  asyncHandler(async (req, res) => {
    const setting = await Setting.findOne({ settingName: req.params.settingName });

    if (!setting) {
      return errorResponse(res, 'Setting not found', 404);
    }

    await Setting.deleteOne({ settingName: req.params.settingName });

    await Activity.logActivity({
      userId: req.user._id,
      type: 'SETTING_DELETED',
      description: `Deleted setting: ${setting.settingName}`,
      context: 'system-settings',
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return successResponse(res, null, 'Setting deleted successfully');
  }),
];

export { createSetting, getSettings, getSettingByName, updateSettingByName, deleteSettingByName };