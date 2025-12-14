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
import { setSchoolId } from "../middleware/schoolMiddleware.js";

const router = express.Router();

// Base events routes
router
  .route("/events")
  .post(
    protect,
    authorize("SUPER_ADMIN", "SCHOOL_ADMIN", "TEACHER"),
    setSchoolId,
    createEvent
  )
  .get(protect, setSchoolId, getEvents);

// Event by ID routes
router
  .route("/events/:id")
  .get(protect, setSchoolId, getEventById)
  .put(protect, setSchoolId, updateEvent)
  .delete(protect, setSchoolId, deleteEvent);

// Special event routes
router.route("/events/upcoming").get(protect, setSchoolId, getUpcomingEvents);
router.route("/events/type").get(protect, setSchoolId, getEventsByType);
router.route("/events/range").get(protect, setSchoolId, getEventsByDateRange);

// Participant management routes
router
  .route("/events/:id/participants")
  .get(protect, setSchoolId, getParticipants)
  .put(protect, setSchoolId, updateParticipants);

// Convenience endpoints
router.route("/range").get(protect, setSchoolId, getEventsByDateRange);
router.route("/type/:type").get(protect, setSchoolId, getEventsByType);
router.route("/upcoming").get(protect, setSchoolId, getUpcomingEvents);

export default router;
