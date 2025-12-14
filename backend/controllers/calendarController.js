// controllers/calendarController.js
import Calendar from "../models/Calendar.js";
import asyncHandler from "express-async-handler";
import Activity from "../models/Activity.js";
import { body, validationResult } from "express-validator";
import { successResponse, errorResponse } from "../utils/apiResponse.js";
import mongoose from "mongoose";

// @desc    Create new event
// @route   POST /api/calendar/events
// @access  Private (SUPER_ADMIN, SCHOOL_ADMIN, TEACHER)
const createEvent = [
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, "Validation failed", 400, errors.array());
    }

    const event = await Calendar.create({
      ...req.body,
      createdBy: req.user._id,
      participants: req.body.participants || [],
    });

    await Activity.logActivity({
      userId: req.user._id,
      type: "EVENT_CREATED",
      description: `Created event: ${req.body.title}`,
      context: "calendar-management",
      metadata: { eventId: event._id },
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });

    return successResponse(res, event, "Event created successfully", 201);
  }),
];

// @desc    Get all events with filters
// @route   GET /api/calendar/events
// @access  Private
const getEvents = asyncHandler(async (req, res) => {
  const { start, end, type, visibility } = req.query;
  let query = {};

  if (start && end) {
    query.start = { $gte: new Date(start) };
    query.end = { $lte: new Date(end) };
  }

  if (type) {
    query.type = type;
  }

  if (visibility) {
    query.visibility = visibility;
  }

  const events = await Calendar.find(query)
    .populate('createdBy', 'name email')
    .populate('participants', 'name email');

  return successResponse(res, events, "Events retrieved successfully");
});

// @desc    Get single event by ID
// @route   GET /api/calendar/events/:id
// @access  Private
const getEventById = asyncHandler(async (req, res) => {
  const event = await Calendar.findById(req.params.id)
    .populate('createdBy', 'name email')
    .populate('participants', 'name email');

  if (!event) {
    return errorResponse(res, "Event not found", 404);
  }

  return successResponse(res, event, "Event retrieved successfully");
});

// @desc    Update event
// @route   PUT /api/calendar/events/:id
// @access  Private
const updateEvent = [
  body("title").optional().notEmpty().withMessage("Title cannot be empty"),
  body("start").optional().isISO8601().withMessage("Invalid start date").toDate(),
  body("end").optional().isISO8601().withMessage("Invalid end date").toDate(),
  body("type")
    .optional()
    .isIn(["GENERAL", "MEETING", "EXAM", "HOLIDAY", "SPORTS"])
    .withMessage("Invalid event type"),
  body("visibility")
    .optional()
    .isIn(["PUBLIC", "PRIVATE", "RESTRICTED"])
    .withMessage("Invalid visibility type"),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, "Validation failed", 400, errors.array());
    }

    const event = await Calendar.findById(req.params.id);
    if (!event) {
      return errorResponse(res, "Event not found", 404);
    }

    // Check authorization
    if (event.createdBy.toString() !== req.user._id.toString() && 
        !["SUPER_ADMIN", "SCHOOL_ADMIN"].includes(req.user.role)) {
      return errorResponse(res, "Not authorized to update this event", 403);
    }

    const updatedEvent = await Calendar.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email')
     .populate('participants', 'name email');

    await Activity.logActivity({
      userId: req.user._id,
      type: "EVENT_UPDATED",
      description: `Updated event: ${event.title}`,
      context: "calendar-management",
      metadata: { eventId: event._id },
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });

    return successResponse(res, updatedEvent, "Event updated successfully");
  }),
];

// @desc    Delete event
// @route   DELETE /api/calendar/events/:id
// @access  Private
const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Calendar.findById(req.params.id);
  if (!event) {
    return errorResponse(res, "Event not found", 404);
  }

  // Check authorization
  if (event.createdBy.toString() !== req.user._id.toString() && 
      !["SUPER_ADMIN", "SCHOOL_ADMIN"].includes(req.user.role)) {
    return errorResponse(res, "Not authorized to delete this event", 403);
  }

  await event.remove();

  await Activity.logActivity({
    userId: req.user._id,
    type: "EVENT_DELETED",
    description: `Deleted event: ${event.title}`,
    context: "calendar-management",
    metadata: { eventId: event._id },
    ip: req.ip,
    userAgent: req.headers["user-agent"],
  });

  return successResponse(res, null, "Event deleted successfully");
});

// @desc    Get upcoming events
// @route   GET /api/calendar/events/upcoming
// @access  Private
const getUpcomingEvents = asyncHandler(async (req, res) => {
  const { limit = 5 } = req.query;
  const events = await Calendar.find({
    start: { $gte: new Date() }
  })
    .sort({ start: 1 })
    .limit(parseInt(limit))
    .populate('createdBy', 'name email')
    .populate('participants', 'name email');

  return successResponse(res, events, "Upcoming events retrieved successfully");
});

// @desc    Get events by type
// @route   GET /api/calendar/events/type
// @access  Private
const getEventsByType = asyncHandler(async (req, res) => {
  const { type } = req.query;
  if (!type) {
    return errorResponse(res, "Event type is required", 400);
  }

  const events = await Calendar.find({ type })
    .populate('createdBy', 'name email')
    .populate('participants', 'name email');

  return successResponse(res, events, "Events retrieved successfully");
});

// @desc    Get events by date range
// @route   GET /api/calendar/events/range
// @access  Private
const getEventsByDateRange = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  if (!startDate || !endDate) {
    return errorResponse(res, "Start and end dates are required", 400);
  }

  const events = await Calendar.find({
    start: { $gte: new Date(startDate) },
    end: { $lte: new Date(endDate) }
  })
    .sort({ start: 1 })
    .populate('createdBy', 'name email')
    .populate('participants', 'name email');

  return successResponse(res, events, "Events retrieved successfully");
});

// @desc    Get event participants
// @route   GET /api/calendar/events/:id/participants
// @access  Private
const getParticipants = asyncHandler(async (req, res) => {
  const event = await Calendar.findById(req.params.id)
    .populate('participants', 'name email role');

  if (!event) {
    return errorResponse(res, "Event not found", 404);
  }

  return successResponse(res, event.participants, "Participants retrieved successfully");
});

// @desc    Update event participants
// @route   PUT /api/calendar/events/:id/participants
// @access  Private
const updateParticipants = [
  body("participants")
    .isArray()
    .withMessage("Participants must be an array of user IDs"),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, "Validation failed", 400, errors.array());
    }

    const event = await Calendar.findById(req.params.id);
    if (!event) {
      return errorResponse(res, "Event not found", 404);
    }

    // Check authorization
    if (event.createdBy.toString() !== req.user._id.toString() && 
        !["SUPER_ADMIN", "SCHOOL_ADMIN"].includes(req.user.role)) {
      return errorResponse(res, "Not authorized to update participants", 403);
    }

    event.participants = req.body.participants;
    await event.save();

    const updatedEvent = await Calendar.findById(req.params.id)
      .populate('participants', 'name email role');

    await Activity.logActivity({
      userId: req.user._id,
      type: "EVENT_PARTICIPANTS_UPDATED",
      description: `Updated participants for event: ${event.title}`,
      context: "calendar-management",
      metadata: { eventId: event._id },
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });

    return successResponse(res, updatedEvent.participants, "Participants updated successfully");
  }),
];

export {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getUpcomingEvents,
  getEventsByType,
  getEventsByDateRange,
  getParticipants,
  updateParticipants,
};
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

export {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getUpcomingEvents,
  getEventsByType,
  getEventsByDateRange,
  getParticipants,
  updateParticipants,
};
