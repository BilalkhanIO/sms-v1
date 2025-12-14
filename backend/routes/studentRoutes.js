// routes/studentRoutes.js
import express from "express";
import {
  createStudent,
  getStudents,
  getStudentsByClass,
  getStudentById,
  updateStudent,
  deleteStudent,
} from "../controllers/studentController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { setSchoolId } from "../middleware/schoolMiddleware.js";

const router = express.Router();

// GET /api/students - Get all students (Admin, Teacher)
// POST /api/students - Create a new student profile (Admin only)
router
  .route("/")
  .get(
    protect,
    authorize("SUPER_ADMIN", "SCHOOL_ADMIN", "TEACHER"),
    setSchoolId,
    getStudents
  )
  .post(
    protect,
    authorize("SUPER_ADMIN", "SCHOOL_ADMIN"),
    setSchoolId,
    createStudent
  );

// GET /api/students/class/:classId - Get students by class (Admin, Teacher)
router
  .route("/class/:classId")
  .get(
    protect,
    authorize("SUPER_ADMIN", "SCHOOL_ADMIN", "TEACHER"),
    setSchoolId,
    getStudentsByClass
  );

// GET /api/students/:id - Get student by ID (Admin, Teacher, Student)
// PUT /api/students/:id - Update student profile (Admin only)
// DELETE /api/students/:id - Delete student profile (Admin only)
router
  .route("/:id")
  .get(protect, setSchoolId, getStudentById)
  .put(
    protect,
    authorize("SUPER_ADMIN", "SCHOOL_ADMIN"),
    setSchoolId,
    updateStudent
  )
  .delete(
    protect,
    authorize("SUPER_ADMIN", "SCHOOL_ADMIN"),
    setSchoolId,
    deleteStudent
  );

export default router;
