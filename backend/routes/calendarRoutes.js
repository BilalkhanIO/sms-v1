// routes/calendarRoutes.js
import express from "express";
import {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent,
  getEventById,
  getUpcomingEvents,
  getEventsByType,
  getEventsByDateRange,
  getParticipants,
  updateParticipants,
} from "../controllers/calendarController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Base events routes
router
  .route("/events")
  .post(protect, authorize("SUPER_ADMIN", "SCHOOL_ADMIN", "TEACHER"), createEvent)
  .get(protect, getEvents);

// Event by ID routes
router
  .route("/events/:id")
  .get(protect, getEventById)
  .put(protect, updateEvent)
  .delete(protect, deleteEvent);

// Special event routes
router.route("/events/upcoming").get(protect, getUpcomingEvents);
router.route("/events/type").get(protect, getEventsByType);
router.route("/events/range").get(protect, getEventsByDateRange);

// Participant management routes
router
  .route("/events/:id/participants")
  .get(protect, getParticipants)
  .put(protect, updateParticipants);

// Convenience endpoints
router.route("/range").get(protect, getEventsByDateRange);
router.route("/type/:type").get(protect, getEventsByType);
router.route("/upcoming").get(protect, getUpcomingEvents);

export default router;
