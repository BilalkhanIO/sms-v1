// routes/assignmentRoutes.js
import express from "express";
import {
  getAssignments,
  getAssignmentById,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  submitAssignment,
  gradeSubmission,
  getMyAssignments,
} from "../controllers/assignmentController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { setSchoolId } from "../middleware/schoolMiddleware.js";

const router = express.Router();

// GET /api/assignments/my — Student: pending/overdue assignments for their class
router.route("/my").get(protect, authorize("STUDENT"), setSchoolId, getMyAssignments);

// GET  /api/assignments — list (Teacher: own; Student: their class; Admin: all)
// POST /api/assignments — create (Teacher, School Admin)
router
  .route("/")
  .get(protect, authorize("SUPER_ADMIN", "SCHOOL_ADMIN", "TEACHER", "STUDENT"), setSchoolId, getAssignments)
  .post(protect, authorize("TEACHER", "SCHOOL_ADMIN"), setSchoolId, createAssignment);

// GET    /api/assignments/:id — get single assignment
// PUT    /api/assignments/:id — update (creator Teacher or Admin; not if CLOSED)
// DELETE /api/assignments/:id — delete (creator Teacher or Admin)
router
  .route("/:id")
  .get(protect, authorize("SUPER_ADMIN", "SCHOOL_ADMIN", "TEACHER", "STUDENT"), setSchoolId, getAssignmentById)
  .put(protect, authorize("TEACHER", "SCHOOL_ADMIN", "SUPER_ADMIN"), setSchoolId, updateAssignment)
  .delete(protect, authorize("TEACHER", "SCHOOL_ADMIN", "SUPER_ADMIN"), setSchoolId, deleteAssignment);

// POST /api/assignments/:id/submit — Student submits assignment
router.route("/:id/submit").post(protect, authorize("STUDENT"), setSchoolId, submitAssignment);

// PUT /api/assignments/:id/grade/:studentId — Teacher grades a submission
router
  .route("/:id/grade/:studentId")
  .put(protect, authorize("TEACHER", "SCHOOL_ADMIN", "SUPER_ADMIN"), setSchoolId, gradeSubmission);

export default router;
