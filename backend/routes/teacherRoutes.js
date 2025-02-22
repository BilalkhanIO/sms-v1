// routes/teacherRoutes.js
import express from "express";
import {
  getTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  updateTeacherStatus,
  getTeacherClasses,
  getTeacherSchedule,
  assignTeacherToClass,
  assignSubjectToTeacher,
  unassignSubjectFromTeacher,
} from "../controllers/teacherController.js";
import { protect, authorize } from "../middleware/authMiddleware.js"; // Import auth middleware

const router = express.Router();

// GET /api/teachers - Get all teachers (Admin only)
// POST /api/teachers - Create a new teacher (Admin only)
router
  .route("/")
  .get(protect, authorize("SUPER_ADMIN", "SCHOOL_ADMIN"), getTeachers)
  .post(protect, authorize("SUPER_ADMIN", "SCHOOL_ADMIN"), createTeacher);

// GET /api/teachers/:id - Get teacher by ID (Admin, or the teacher themselves)
// PUT /api/teachers/:id - Update a teacher (Admin only)
// DELETE /api/teachers/:id - Delete a teacher (Admin only)
router
  .route("/:id")
  .get(protect, getTeacherById) // Removed redundant authorize, handled in controller
  .put(protect, authorize("SUPER_ADMIN", "SCHOOL_ADMIN"), updateTeacher)
  .delete(protect, authorize("SUPER_ADMIN", "SCHOOL_ADMIN"), deleteTeacher);

// PUT /api/teachers/:id/status - Update teacher status (Admin only)
router
  .route("/:id/status")
  .put(protect, authorize("SUPER_ADMIN", "SCHOOL_ADMIN"), updateTeacherStatus);

// GET /api/teachers/:id/classes - Get teacher's classes (Admin, or the teacher themselves)
router.route("/:id/classes").get(protect, getTeacherClasses);

// GET /api/teachers/:id/schedule - Get teacher's schedule (Admin, or the teacher themselves)
router.route("/:id/schedule").get(protect, getTeacherSchedule);

// PUT /api/teachers/:id/assign-class - Assign teacher to a class (Admin only)
router
  .route("/:id/assign-class")
  .put(protect, authorize("SUPER_ADMIN", "SCHOOL_ADMIN"), assignTeacherToClass);

// PUT /api/teachers/:id/assign-subject - Assign subject to a teacher (Admin only)
router
  .route("/:id/assign-subject")
  .put(
    protect,
    authorize("SUPER_ADMIN", "SCHOOL_ADMIN"),
    assignSubjectToTeacher
  );

// PUT /api/teachers/:id/unassign-subject - Unassign subject from teacher
router
  .route("/:id/unassign-subject")
  .put(
    protect,
    authorize("SUPER_ADMIN", "SCHOOL_ADMIN"),
    unassignSubjectFromTeacher
  );
export default router;
