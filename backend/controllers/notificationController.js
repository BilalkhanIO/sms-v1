// controllers/notificationController.js
import Notification from "../models/Notification.js";
import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

// ---------------------------------------------------------------------------
// Internal helper — can be imported by other controllers without HTTP context
// ---------------------------------------------------------------------------

/**
 * sendNotification — creates a notification document for a single user.
 * Safe to call from any controller; failures are logged but never bubble up
 * to crash the caller.
 *
 * @param {string|ObjectId} userId    - Recipient's User _id
 * @param {string}          message   - Notification message text
 * @param {string}          [type]    - "INFO" | "WARNING" | "ALERT" | "ANNOUNCEMENT"
 * @param {string}          [link]    - Optional deep-link URL
 * @returns {Promise<Document>}
 */
export const sendNotification = async (userId, message, type = "INFO", link = null) => {
  try {
    const notification = await Notification.create({
      recipient: userId,
      message,
      type,
      link: link || undefined,
    });
    return notification;
  } catch (error) {
    console.error("sendNotification failed:", error);
    throw error;
  }
};

// ---------------------------------------------------------------------------
// Route handlers
// ---------------------------------------------------------------------------

// @desc    Get all notifications for the logged-in user
// @route   GET /api/notifications
// @access  Private
const getNotifications = [
  protect,
  asyncHandler(async (req, res) => {
    const { unread } = req.query;

    const query = { recipient: req.user._id };
    if (unread === "true") {
      query.read = false;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .lean();

    return successResponse(res, notifications, "Notifications retrieved successfully");
  }),
];

// @desc    Get unread notification count for the logged-in user
// @route   GET /api/notifications/unread-count
// @access  Private
const getUnreadCount = [
  protect,
  asyncHandler(async (req, res) => {
    const count = await Notification.countDocuments({
      recipient: req.user._id,
      read: false,
    });

    return successResponse(res, { count }, "Unread notification count retrieved");
  }),
];

// @desc    Mark a single notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = [
  protect,
  asyncHandler(async (req, res) => {
    const notification = await Notification.findOne({
      _id: req.params.id,
      recipient: req.user._id,
    });

    if (!notification) {
      return errorResponse(res, "Notification not found", 404);
    }

    if (!notification.read) {
      notification.read = true;
      notification.readAt = new Date();
      await notification.save();
    }

    return successResponse(res, notification, "Notification marked as read");
  }),
];

// @desc    Mark all notifications as read for the logged-in user
// @route   PUT /api/notifications/read-all
// @access  Private
const markAllAsRead = [
  protect,
  asyncHandler(async (req, res) => {
    const result = await Notification.updateMany(
      { recipient: req.user._id, read: false },
      { $set: { read: true, readAt: new Date() } }
    );

    return successResponse(
      res,
      { modifiedCount: result.modifiedCount },
      "All notifications marked as read"
    );
  }),
];

// @desc    Delete a single notification
// @route   DELETE /api/notifications/:id
// @access  Private
const deleteNotification = [
  protect,
  asyncHandler(async (req, res) => {
    const notification = await Notification.findOne({
      _id: req.params.id,
      recipient: req.user._id,
    });

    if (!notification) {
      return errorResponse(res, "Notification not found", 404);
    }

    await Notification.deleteOne({ _id: notification._id });

    return successResponse(res, null, "Notification deleted successfully");
  }),
];

// @desc    Create a notification (internal admin helper exposed as route)
// @route   POST /api/notifications
// @access  Private (School Admin, Super Admin)
const createNotification = [
  protect,
  authorize("SCHOOL_ADMIN", "SUPER_ADMIN"),

  body("recipient").notEmpty().withMessage("Recipient user ID is required").isMongoId().withMessage("Invalid recipient ID"),
  body("message").notEmpty().withMessage("Message is required").trim(),
  body("type")
    .optional()
    .isIn(["INFO", "WARNING", "ALERT", "ANNOUNCEMENT"])
    .withMessage("Invalid notification type"),
  body("link").optional().isURL().withMessage("Link must be a valid URL"),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, "Validation failed", 400, errors.array());
    }

    const { recipient, message, type, link } = req.body;

    const notification = await sendNotification(recipient, message, type, link);

    return successResponse(res, notification, "Notification created successfully", 201);
  }),
];

// @desc    Send bulk notifications to multiple users
// @route   POST /api/notifications/bulk
// @access  Private (School Admin, Super Admin)
const sendBulkNotification = [
  protect,
  authorize("SCHOOL_ADMIN", "SUPER_ADMIN"),

  body("userIds")
    .isArray({ min: 1 }).withMessage("userIds must be a non-empty array")
    .custom((ids) => {
      const allMongoIds = ids.every((id) => /^[a-f\d]{24}$/i.test(id));
      if (!allMongoIds) throw new Error("All userIds must be valid MongoDB IDs");
      return true;
    }),
  body("message").notEmpty().withMessage("Message is required").trim(),
  body("type")
    .optional()
    .isIn(["INFO", "WARNING", "ALERT", "ANNOUNCEMENT"])
    .withMessage("Invalid notification type"),
  body("link").optional().isURL().withMessage("Link must be a valid URL"),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, "Validation failed", 400, errors.array());
    }

    const { userIds, message, type = "INFO", link } = req.body;

    const docs = userIds.map((userId) => ({
      recipient: userId,
      message,
      type,
      link: link || undefined,
    }));

    const notifications = await Notification.insertMany(docs, { ordered: false });

    return successResponse(
      res,
      { created: notifications.length },
      `Bulk notification sent to ${notifications.length} user(s)`,
      201
    );
  }),
];

export {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  createNotification,
  sendBulkNotification,
};
