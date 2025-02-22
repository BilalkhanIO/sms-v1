// routes/studentRoutes.js
import express from "express";
import {
  createStudent,
  getStudentsByClass,
  getStudentById,
  updateStudent,
  deleteStudent,
} from "../controllers/studentController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/students - Create a new student profile (Admin only)
router
  .route("/")
  .post(protect, authorize("SUPER_ADMIN", "SCHOOL_ADMIN"), createStudent);

// GET /api/students/class/:classId - Get students by class (Admin, Teacher)
router
  .route("/class/:classId")
  .get(
    protect,
    authorize("SUPER_ADMIN", "SCHOOL_ADMIN", "TEACHER"),
    getStudentsByClass
  );

// GET /api/students/:id - Get student by ID (Admin, Teacher, Student)
// PUT /api/students/:id - Update student profile (Admin only)
// DELETE /api/students/:id - Delete student profile (Admin only)
router
  .route("/:id")
  .get(protect, getStudentById) // Removed redundant authorize
  .put(protect, authorize("SUPER_ADMIN", "SCHOOL_ADMIN"), updateStudent)
  .delete(protect, authorize("SUPER_ADMIN", "SCHOOL_ADMIN"), deleteStudent);

export default router;
