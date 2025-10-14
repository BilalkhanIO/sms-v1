// routes/calendarRoutes.js
import express from "express";
import {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent,
  getEventById,
  getEventsByDateRange,
  getEventsByType,
  getUpcomingEvents,
} from "../controllers/calendarController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/calendar - Create a new event (Admin, Teacher)
// GET /api/calendar - Get events within a date range (All roles)
router
  .route("/")
  .post(
    protect,
    authorize("SUPER_ADMIN", "SCHOOL_ADMIN", "TEACHER"),
    createEvent
  )
  .get(protect, getEvents); // Removed redundant authorize

// GET /api/calendar/:id - Get event by ID (All roles)
// PUT /api/calendar/:id - Update event (Admin, Teacher, creator)
// DELETE /api/calendar/:id - Delete event (Admin, creator)
router
  .route("/:id")
  .get(protect, getEventById) // Removed redundant authorize
  .put(protect, updateEvent) // Removed redundant authorize
  .delete(protect, deleteEvent); // Removed redundant authorize

// Convenience endpoints
router.route("/range").get(protect, getEventsByDateRange);
router.route("/type/:type").get(protect, getEventsByType);
router.route("/upcoming").get(protect, getUpcomingEvents);

export default router;
