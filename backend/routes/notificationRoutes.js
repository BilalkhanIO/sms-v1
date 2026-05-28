// routes/notificationRoutes.js
import express from "express";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  createNotification,
  sendBulkNotification,
} from "../controllers/notificationController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET  /api/notifications              — list notifications for logged-in user (?unread=true)
// POST /api/notifications              — create single notification (Admin only)
router
  .route("/")
  .get(protect, getNotifications)
  .post(protect, authorize("SCHOOL_ADMIN", "SUPER_ADMIN"), createNotification);

// POST /api/notifications/bulk         — broadcast to many users (Admin only)
router
  .route("/bulk")
  .post(protect, authorize("SCHOOL_ADMIN", "SUPER_ADMIN"), sendBulkNotification);

// GET /api/notifications/unread-count  — return unread count for logged-in user
// Must be before /:id so "unread-count" is not treated as an ID
router.route("/unread-count").get(protect, getUnreadCount);

// PUT /api/notifications/read-all      — mark all as read for logged-in user
// Must be before /:id so "read-all" is not treated as an ID
router.route("/read-all").put(protect, markAllAsRead);

// PUT    /api/notifications/:id/read   — mark single notification as read
router.route("/:id/read").put(protect, markAsRead);

// DELETE /api/notifications/:id        — delete a notification (owner only)
router.route("/:id").delete(protect, deleteNotification);

export default router;
