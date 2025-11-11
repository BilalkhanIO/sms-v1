// controllers/calendarController.js
import Calendar from "../models/Calendar.js";
import asyncHandler from "express-async-handler";
import Activity from "../models/Activity.js";
import { body, validationResult } from "express-validator";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";
import mongoose from "mongoose";

// @desc    Create new event
// @route   POST /api/events
// @access  Private
const createEvent = [
  protect, // Ensure the user is authenticated

  // Validation rules
  body("title").notEmpty().withMessage("Title is required"),
  body("start").isISO8601().withMessage("Invalid start date").toDate(),
  body("end").isISO8601().withMessage("Invalid end date").toDate(),
  body("type")
    .optional()
    .isIn(["GENERAL", "MEETING", "EXAM", "HOLIDAY", "SPORTS"])
    .withMessage("Invalid event type"),
  body("visibility")
    .optional()
    .isIn(["PUBLIC", "PRIVATE", "RESTRICTED"])
    .withMessage("Invalid visibility type"),
  body("location").optional(),
  body("color").optional(),
  body("reminders")
    .optional()
    .isArray()
    .withMessage("Reminders must be an array"),
  body("recurrence")
    .optional()
    .isIn([null, "DAILY", "WEEKLY", "MONTHLY", "YEARLY"])
    .withMessage("Invalid recurrence type"),

  asyncHandler(async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, "Validation failed", 400, errors.array());
    }
    const {
      title,
      description,
      start,
      end,
      type,
      participants,
      visibility,
      location,
      color,
      reminders,
      recurrence,
    } = req.body;

    // Create the event
    const event = await Calendar.create({
      title,
      description,
      start,
      end,
      type,
      createdBy: req.user._id, // Set the creator to the logged-in user
      participants: participants || [], // Ensure participants is an array
      visibility,
      location,
      color,
      reminders,
      recurrence,
    });

    // Log the activity
    await Activity.logActivity({
      userId: req.user._id,
      type: "EVENT_CREATED",
      description: `Created event: ${title}`,
      context: "calendar-management",
      metadata: { eventId: event._id },
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });

    return successResponse(res, event, "Event created successfully", 201);
  }),
];

// @desc    Get events within date range
// @route   GET /api/events
// @access  Private
const getEvents = [
  protect, // Ensure user is authenticated
  asyncHandler(async (req, res) => {
    const { start, end } = req.query;

    // Validate start and end dates
    if (!start || !end || !Date.parse(start) || !Date.parse(end)) {
      return errorResponse(res, "Invalid start or end date", 400);
    }

    const startDate = new Date(start);
    const endDate = new Date(end);
    // Create a filter object to query events based on date range and user access
    const filter = {
      start: { $lte: endDate }, // Event starts before the end date
      end: { $gte: startDate }, // Event ends after the start date
      $or: [
        { visibility: "PUBLIC" }, // Public events
        { createdBy: req.user._id }, // Events created by the user
        { participants: req.user._id }, // Events where the user is a participant
      ],
    };

    // Find events matching the filter
    const events = await Calendar.find(filter)
      .populate("createdBy", "firstName lastName") // Populate the creator's name
      .populate("participants", "firstName lastName role"); // Populate participant details

    return successResponse(res, events, "Events retrieved successfully");
  }),
];

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private
const updateEvent = [
  protect, // Ensure the user is authenticated
  // Validate request body
  body("title").optional().notEmpty().withMessage("Title is required"),
  body("start")
    .optional()
    .isISO8601()
    .withMessage("Invalid start date")
    .toDate(),
  body("end").optional().isISO8601().withMessage("Invalid end date").toDate(),
  body("type")
    .optional()
    .isIn(["GENERAL", "MEETING", "EXAM", "HOLIDAY", "SPORTS"])
    .withMessage("Invalid event type"),
  body("visibility")
    .optional()
    .isIn(["PUBLIC", "PRIVATE", "RESTRICTED"])
    .withMessage("Invalid visibility type"),
  body("reminders")
    .optional()
    .isArray()
    .withMessage("Reminders must be an array"),
  body("recurrence")
    .optional()
    .isIn([null, "DAILY", "WEEKLY", "MONTHLY", "YEARLY"])
    .withMessage("Invalid recurrence type"),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, "Validation failed", 400, errors.array());
    }

    const event = await Calendar.findById(req.params.id);

    if (!event) {
      return errorResponse(res, "Event not found", 404);
    }
    // Check if the user is authorized to update the event (creator)
    if (
      event.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== "SUPER_ADMIN" &&
      req.user.role !== "SCHOOL_ADMIN"
    ) {
      return errorResponse(res, "Not authorized to update this event", 403);
    }
    const {
      title,
      description,
      start,
      end,
      type,
      participants,
      visibility,
      location,
      color,
      reminders,
      recurrence,
    } = req.body;
    const updateData = {
      title: title || event.title,
      description: description || event.description,
      start: start || event.start,
      end: end || event.end,
      type: type || event.type,
      participants: participants || event.participants,
      visibility: visibility || event.visibility,
      location: location || event.location,
      color: color || event.color,
      reminders: reminders || event.reminders,
      recurrence: recurrence || event.recurrence,
    };

    // Use findOneAndUpdate for atomic operation and pre-save hooks
    const updatedEvent = await Calendar.findOneAndUpdate(
      { _id: req.params.id },
      updateData,
      { new: true, runValidators: true } // Return updated document and run validations
    );

    // Log activity
    await Activity.logActivity({
      userId: req.user._id,
      type: "EVENT_UPDATED",
      description: `Updated event: ${updatedEvent.title}`,
      context: "calendar-management",
      metadata: { eventId: updatedEvent._id },
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });

    return successResponse(res, updatedEvent, "Event updated successfully");
  }),
];

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private
const deleteEvent = [
  protect, // Ensure user is authenticated
  asyncHandler(async (req, res) => {
    const event = await Calendar.findById(req.params.id);

    if (!event) {
      return errorResponse(res, "Event not found", 404);
    }

    // Check if the user is authorized to delete the event
    if (
      event.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== "SUPER_ADMIN" &&
      req.user.role !== "SCHOOL_ADMIN"
    ) {
      return errorResponse(res, "Not authorized to delete this event", 403);
    }

    await Calendar.deleteOne({ _id: req.params.id });

    // Log activity
    await Activity.logActivity({
      userId: req.user._id,
      type: "EVENT_DELETED",
      description: `Deleted event: ${event.title}`,
      context: "calendar-management",
      metadata: { eventId: event._id },
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });

    return successResponse(res, null, "Event removed");
  }),
];

// @desc    Get event by ID
// @route   GET /api/events/:id
// @access  Private
const getEventById = [
  protect, // Ensure user is authenticated
  asyncHandler(async (req, res) => {
    const event = await Calendar.findById(req.params.id)
      .populate("createdBy", "firstName lastName")
      .populate("participants", "firstName lastName role");

    if (!event) {
      return errorResponse(res, "Event not found", 404);
    }

    // Check if the user has access to the event (public, created by user, or user is a participant)
    if (
      event.visibility !== "PUBLIC" &&
      event.createdBy._id.toString() !== req.user._id.toString() &&
      !event.participants.some(
        (p) => p._id.toString() === req.user._id.toString()
      ) &&
      req.user.role !== "SUPER_ADMIN" &&
      req.user.role !== "SCHOOL_ADMIN"
    ) {
      return errorResponse(res, "Not authorized to access this event", 403);
    }

    return successResponse(res, event, "Event retrieved successfully");
  }),
];

export { createEvent, getEvents, updateEvent, deleteEvent, getEventById };

// ----- Additional endpoints to align with frontend -----
// @desc    Get events by date range via /calendar/range
// @route   GET /api/calendar/range?startDate=&endDate=
// @access  Private
export const getEventsByDateRange = [
  protect,
  asyncHandler(async (req, res) => {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) return errorResponse(res, "startDate and endDate are required", 400);
    const start = new Date(startDate);
    const end = new Date(endDate);
    const events = await Calendar.find({ start: { $lte: end }, end: { $gte: start } })
      .populate("createdBy", "firstName lastName")
      .populate("participants", "firstName lastName role");
    return successResponse(res, events, "Events retrieved successfully");
  }),
];

// @desc    Get events by type
// @route   GET /api/calendar/type/:type
// @access  Private
export const getEventsByType = [
  protect,
  asyncHandler(async (req, res) => {
    const { type } = req.params;
    const events = await Calendar.find({ type })
      .sort("-start")
      .limit(50)
      .lean();
    return successResponse(res, events, "Events retrieved successfully");
  }),
];

// @desc    Get upcoming events
// @route   GET /api/calendar/upcoming?limit=5
// @access  Private
export const getUpcomingEvents = [
  protect,
  asyncHandler(async (req, res) => {
    const limit = Number(req.query.limit) || 5;
    const events = await Calendar.find({ start: { $gte: new Date() } })
      .sort("start")
      .limit(limit)
      .lean();
    return successResponse(res, events, "Upcoming events retrieved successfully");
  }),
];
