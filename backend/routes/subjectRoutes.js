// routes/subjectRoutes.js
import express from "express";
import {
  createSubject,
  getSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
  getSubjectsByClass,
  getSubjectsByTeacher,
  assignTeacher,
} from "../controllers/subjectController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/subjects - Create a new subject (Admin only)
router
  .route("/")
  .post(protect, authorize("SUPER_ADMIN", "SCHOOL_ADMIN"), createSubject);
// GET /api/subjects - Get subjects based on user role (Admin, Teacher, Student)
router.route("/").get(protect, getSubjects); //Removed Redundant Authorize
// Class and teacher filtered
router.route("/class/:classId").get(protect, getSubjectsByClass);
router.route("/teacher/:teacherId").get(protect, getSubjectsByTeacher);
// Assign teacher to subject
router.route("/:id/assign-teacher").post(protect, authorize("SUPER_ADMIN", "SCHOOL_ADMIN"), assignTeacher);
// GET /api/subjects/:id
router.route("/:id").get(protect, getSubjectById); //Removed Redundant Authorize
// PUT /api/subjects/:id
router
  .route("/:id")
  .put(protect, authorize("SUPER_ADMIN", "SCHOOL_ADMIN"), updateSubject);
// DEL /api/subjects/:id
router
  .route("/:id")
  .delete(protect, authorize("SUPER_ADMIN", "SCHOOL_ADMIN"), deleteSubject);

export default router;
