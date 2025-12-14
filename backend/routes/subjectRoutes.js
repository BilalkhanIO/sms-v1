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
import { setSchoolId } from "../middleware/schoolMiddleware.js";

const router = express.Router();

// POST /api/subjects - Create a new subject (Admin only)
router
  .route("/")
  .post(
    protect,
    authorize("SUPER_ADMIN", "SCHOOL_ADMIN"),
    setSchoolId,
    createSubject
  );
// GET /api/subjects - Get subjects based on user role (Admin, Teacher, Student)
router.route("/").get(protect, setSchoolId, getSubjects);
// Class and teacher filtered
router.route("/class/:classId").get(protect, setSchoolId, getSubjectsByClass);
router
  .route("/teacher/:teacherId")
  .get(protect, setSchoolId, getSubjectsByTeacher);
// Assign teacher to subject
router
  .route("/:id/assign-teacher")
  .post(
    protect,
    authorize("SUPER_ADMIN", "SCHOOL_ADMIN"),
    setSchoolId,
    assignTeacher
  );
// GET /api/subjects/:id
router.route("/:id").get(protect, setSchoolId, getSubjectById); //Removed Redundant Authorize
// PUT /api/subjects/:id
router
  .route("/:id")
  .put(
    protect,
    authorize("SUPER_ADMIN", "SCHOOL_ADMIN"),
    setSchoolId,
    updateSubject
  );
// DEL /api/subjects/:id
router
  .route("/:id")
  .delete(
    protect,
    authorize("SUPER_ADMIN", "SCHOOL_ADMIN"),
    setSchoolId,
    deleteSubject
  );

export default router;
