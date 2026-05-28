// controllers/messageController.js
import Message from "../models/Message.js";
import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

// @desc    Get inbox messages for the logged-in user
// @route   GET /api/messages/inbox
// @access  Private
const getMessages = [
  protect,
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, type } = req.query;

    const query = { recipients: req.user._id };
    if (req.schoolId) query.school = req.schoolId;
    if (type) query.type = type;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Message.countDocuments(query);
    const messages = await Message.find(query)
      .populate("sender", "firstName lastName email role")
      .select("-readBy")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Annotate each message with whether the current user has read it
    const userId = req.user._id.toString();
    const annotated = messages.map((msg) => ({
      ...msg,
      isRead: (msg.readBy || []).some((r) => r.user.toString() === userId),
    }));

    return successResponse(
      res,
      { messages: annotated, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) },
      "Inbox retrieved successfully"
    );
  }),
];

// @desc    Get messages sent by the logged-in user
// @route   GET /api/messages/sent
// @access  Private
const getSentMessages = [
  protect,
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, type } = req.query;

    const query = { sender: req.user._id };
    if (req.schoolId) query.school = req.schoolId;
    if (type) query.type = type;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Message.countDocuments(query);
    const messages = await Message.find(query)
      .populate("recipients", "firstName lastName email role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    return successResponse(
      res,
      { messages, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) },
      "Sent messages retrieved successfully"
    );
  }),
];

// @desc    Get a single message by ID
// @route   GET /api/messages/:id
// @access  Private (sender or recipient)
const getMessageById = [
  protect,
  asyncHandler(async (req, res) => {
    const message = await Message.findById(req.params.id)
      .populate("sender", "firstName lastName email role")
      .populate("recipients", "firstName lastName email role")
      .lean();

    if (!message) {
      return errorResponse(res, "Message not found", 404);
    }

    const userId = req.user._id.toString();
    const isSender = message.sender._id.toString() === userId;
    const isRecipient = message.recipients.some((r) => r._id.toString() === userId);
    const isAdmin =
      req.user.role === "SCHOOL_ADMIN" || req.user.role === "SUPER_ADMIN";

    if (!isSender && !isRecipient && !isAdmin) {
      return errorResponse(res, "Not authorized to view this message", 403);
    }

    return successResponse(res, message, "Message retrieved successfully");
  }),
];

// @desc    Send a new message
//          - ANNOUNCEMENT/CIRCULAR type requires SCHOOL_ADMIN or SUPER_ADMIN
// @route   POST /api/messages
// @access  Private
const sendMessage = [
  protect,

  body("recipients")
    .isArray({ min: 1 })
    .withMessage("At least one recipient is required"),
  body("recipients.*")
    .isMongoId()
    .withMessage("Invalid recipient ID"),
  body("body")
    .notEmpty()
    .withMessage("Message body is required")
    .trim(),
  body("subject")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Subject cannot exceed 200 characters"),
  body("type")
    .optional()
    .isIn(["DIRECT", "ANNOUNCEMENT", "CIRCULAR"])
    .withMessage("Invalid message type"),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, "Validation failed", 400, errors.array());
    }

    const { recipients, subject, body: msgBody, type = "DIRECT", attachments, parentMessage } = req.body;

    // Only admins can send ANNOUNCEMENT or CIRCULAR messages
    if (
      (type === "ANNOUNCEMENT" || type === "CIRCULAR") &&
      req.user.role !== "SCHOOL_ADMIN" &&
      req.user.role !== "SUPER_ADMIN"
    ) {
      return errorResponse(
        res,
        "Only school administrators can send announcements or circulars",
        403
      );
    }

    const message = await Message.create({
      sender: req.user._id,
      recipients,
      subject,
      body: msgBody,
      type,
      school: req.schoolId || null,
      attachments: attachments || [],
      parentMessage: parentMessage || null,
      readBy: [],
    });

    const populated = await Message.findById(message._id)
      .populate("sender", "firstName lastName email role")
      .populate("recipients", "firstName lastName email role")
      .lean();

    return successResponse(res, populated, "Message sent successfully", 201);
  }),
];

// @desc    Mark a message as read by the logged-in user
// @route   PUT /api/messages/:id/read
// @access  Private (recipient only)
const markAsRead = [
  protect,
  asyncHandler(async (req, res) => {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return errorResponse(res, "Message not found", 404);
    }

    const userId = req.user._id.toString();
    const isRecipient = message.recipients.some((r) => r.toString() === userId);

    if (!isRecipient) {
      return errorResponse(res, "Not authorized to mark this message as read", 403);
    }

    const alreadyRead = message.readBy.some((r) => r.user.toString() === userId);
    if (!alreadyRead) {
      message.readBy.push({ user: req.user._id, readAt: new Date() });
      await message.save();
    }

    return successResponse(res, null, "Message marked as read");
  }),
];

// @desc    Delete a message (sender only; marks as deleted for sender)
//          Implemented as a hard delete scoped to sender ownership.
// @route   DELETE /api/messages/:id
// @access  Private (sender only)
const deleteMessage = [
  protect,
  asyncHandler(async (req, res) => {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return errorResponse(res, "Message not found", 404);
    }

    const isSender = message.sender.toString() === req.user._id.toString();
    const isAdmin =
      req.user.role === "SCHOOL_ADMIN" || req.user.role === "SUPER_ADMIN";

    if (!isSender && !isAdmin) {
      return errorResponse(res, "Only the sender can delete this message", 403);
    }

    await Message.deleteOne({ _id: message._id });
    return successResponse(res, null, "Message deleted successfully");
  }),
];

export {
  getMessages,
  getSentMessages,
  getMessageById,
  sendMessage,
  markAsRead,
  deleteMessage,
};
