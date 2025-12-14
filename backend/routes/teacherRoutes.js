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
import { protect, authorize } from "../middleware/authMiddleware.js";
import { setSchoolId } from "../middleware/schoolMiddleware.js";

const router = express.Router();

// GET /api/teachers - Get all teachers (Admin only)
// POST /api/teachers - Create a new teacher (Admin only)
router
  .route("/")
  .get(protect, authorize("SUPER_ADMIN", "SCHOOL_ADMIN"), setSchoolId, getTeachers)
  .post(
    protect,
    authorize("SUPER_ADMIN", "SCHOOL_ADMIN"),
    setSchoolId,
    createTeacher
  );

// GET /api/teachers/:id - Get teacher by ID (Admin, or the teacher themselves)
// PUT /api/teachers/:id - Update a teacher (Admin only)
// DELETE /api/teachers/:id - Delete a teacher (Admin only)
router
  .route("/:id")
  .get(protect, setSchoolId, getTeacherById)
  .put(
    protect,
    authorize("SUPER_ADMIN", "SCHOOL_ADMIN"),
    setSchoolId,
    updateTeacher
  )
  .delete(
    protect,
    authorize("SUPER_ADMIN", "SCHOOL_ADMIN"),
    setSchoolId,
    deleteTeacher
  );

// PUT /api/teachers/:id/status - Update teacher status (Admin only)
router
  .route("/:id/status")
  .put(
    protect,
    authorize("SUPER_ADMIN", "SCHOOL_ADMIN"),
    setSchoolId,
    updateTeacherStatus
  );

// GET /api/teachers/:id/classes - Get teacher's classes (Admin, or the teacher themselves)
router.route("/:id/classes").get(protect, setSchoolId, getTeacherClasses);

// GET /api/teachers/:id/schedule - Get teacher's schedule (Admin, or the teacher themselves)
router.route("/:id/schedule").get(protect, setSchoolId, getTeacherSchedule);

// PUT /api/teachers/:id/assign-class - Assign teacher to a class (Admin only)
router
  .route("/:id/assign-class")
  .put(
    protect,
    authorize("SUPER_ADMIN", "SCHOOL_ADMIN"),
    setSchoolId,
    assignTeacherToClass
  );

// PUT /api/teachers/:id/assign-subject - Assign subject to a teacher (Admin only)
router
  .route("/:id/assign-subject")
  .put(
    protect,
    authorize("SUPER_ADMIN", "SCHOOL_ADMIN"),
    setSchoolId,
    assignSubjectToTeacher
  );

// PUT /api/teachers/:id/unassign-subject - Unassign subject from teacher
router
  .route("/:id/unassign-subject")
  .put(
    protect,
    authorize("SUPER_ADMIN", "SCHOOL_ADMIN"),
    setSchoolId,
    unassignSubjectFromTeacher
  );
export default router;
