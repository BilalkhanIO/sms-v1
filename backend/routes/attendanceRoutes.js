// routes/attendanceRoutes.js
import express from "express";
import {
  markAttendance,
  getAttendanceReport,
  bulkUpdateAttendance,
} from "../controllers/attendanceController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();
router.route("/").post(protect, markAttendance);

router.route("/bulk").put(protect, bulkUpdateAttendance);

router.route("/report").get(protect, admin, getAttendanceReport);

export default router;
