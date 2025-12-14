// routes/attendanceRoutes.js
import express from "express";
import {
  markAttendance,
  getAttendance,
  getAttendanceReport,
  bulkUpdateAttendance,
  getAttendanceById,
  updateAttendanceById,
  deleteAttendanceById,
  getStudentAttendance,
  getClassAttendance,
  getAttendanceStats,
} from "../controllers/attendanceController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/attendance - Get attendance records (Admin, Teacher)
// POST /api/attendance - Mark attendance (Teacher only)
router.route("/")
  .get(protect, authorize("SUPER_ADMIN", "SCHOOL_ADMIN", "TEACHER"), getAttendance)
  .post(protect, authorize("TEACHER"), markAttendance);

// PUT /api/attendance/bulk - Bulk update attendance (Teacher only)
router.route("/bulk").put(protect, authorize("TEACHER"), bulkUpdateAttendance);

// GET /api/attendance/report - Get attendance report (Admin only)
router
  .route("/report")
  .get(protect, authorize("SUPER_ADMIN", "SCHOOL_ADMIN"), getAttendanceReport);

// GET /api/attendance/:id - Get attendance by ID (Admin, Teacher)
router
  .route("/:id")
  .get(
    protect,
    authorize("SUPER_ADMIN", "SCHOOL_ADMIN", "TEACHER"),
    getAttendanceById
  )
  .put(protect, authorize("TEACHER", "SUPER_ADMIN", "SCHOOL_ADMIN"), updateAttendanceById)
  .delete(protect, authorize("TEACHER", "SUPER_ADMIN", "SCHOOL_ADMIN"), deleteAttendanceById);

// Additional listings and stats
router.route("/student/:studentId").get(protect, getStudentAttendance);
router.route("/class/:classId").get(protect, authorize("SUPER_ADMIN", "SCHOOL_ADMIN", "TEACHER"), getClassAttendance);
router.route("/stats").get(protect, authorize("SUPER_ADMIN", "SCHOOL_ADMIN", "TEACHER"), getAttendanceStats);

export default router;
