// routes/messageRoutes.js
import express from "express";
import {
  getMessages,
  getSentMessages,
  getMessageById,
  sendMessage,
  markAsRead,
  deleteMessage,
} from "../controllers/messageController.js";
import { protect } from "../middleware/authMiddleware.js";
import { setSchoolId } from "../middleware/schoolMiddleware.js";

const router = express.Router();

// GET /api/messages/inbox - Get inbox messages for the logged-in user
router
  .route("/inbox")
  .get(protect, setSchoolId, getMessages);

// GET /api/messages/sent - Get messages sent by the logged-in user
router
  .route("/sent")
  .get(protect, setSchoolId, getSentMessages);

// GET    /api/messages - (alias for inbox, optional convenience)
// POST   /api/messages - Send a new message
router
  .route("/")
  .get(protect, setSchoolId, getMessages)
  .post(protect, setSchoolId, sendMessage);

// PUT /api/messages/:id/read - Mark a message as read
router
  .route("/:id/read")
  .put(protect, setSchoolId, markAsRead);

// GET    /api/messages/:id - Get a single message
// DELETE /api/messages/:id - Delete a message (sender only)
router
  .route("/:id")
  .get(protect, setSchoolId, getMessageById)
  .delete(protect, setSchoolId, deleteMessage);

export default router;
