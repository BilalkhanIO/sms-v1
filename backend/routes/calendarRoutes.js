// routes/calendarRoutes.js
import express from "express";
import { createEvent, getEvents } from "../controllers/calendarController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.route("/").post(protect, createEvent).get(protect, getEvents);

export default router;
