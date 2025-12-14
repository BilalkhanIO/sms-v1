// routes/examRoutes.js
import express from "express";
import {
  createExam,
  updateExamStatus,
  getExamResults,
  getExams,
  getExamById,
  updateExam,
  deleteExam,
  updateExamResult,
  getExamsByClass,
  getExamsBySubject,
  submitResults,
  getStudentExamResult,
  generateReportCard,
} from "../controllers/examController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { setSchoolId } from "../middleware/schoolMiddleware.js";

const router = express.Router();

// GET /api/exams - Get all exams (Admin, Teacher)
// POST /api/exams - Create a new exam (Teacher, Admin)
router
  .route("/")
  .get(
    protect,
    authorize("SUPER_ADMIN", "SCHOOL_ADMIN", "TEACHER"),
    setSchoolId,
    getExams
  )
  .post(
    protect,
    authorize("TEACHER", "SUPER_ADMIN", "SCHOOL_ADMIN"),
    setSchoolId,
    createExam
  );

// Convenience filters
router.route("/class/:classId").get(protect, setSchoolId, getExamsByClass);
router
  .route("/subject/:subjectId")
  .get(
    protect,
    authorize("SUPER_ADMIN", "SCHOOL_ADMIN", "TEACHER"),
    setSchoolId,
    getExamsBySubject
  );

// GET /api/exams/:id - Get exam by ID (Admin, Teacher)
// PUT /api/exams/:id - Update exam (Teacher, Admin)
// DELETE /api/exams/:id - Delete exam (Admin only)
router
  .route("/:id")
  .get(protect, setSchoolId, getExamById) //Authorize removed since it is handled in controller
  .put(
    protect,
    authorize("TEACHER", "SUPER_ADMIN", "SCHOOL_ADMIN"),
    setSchoolId,
    updateExam
  )
  .delete(
    protect,
    authorize("SUPER_ADMIN", "SCHOOL_ADMIN"),
    setSchoolId,
    deleteExam
  );

// PUT /api/exams/:id/status - Update exam status (Teacher, Admin)
router
  .route("/:id/status")
  .put(
    protect,
    authorize("TEACHER", "SUPER_ADMIN", "SCHOOL_ADMIN"),
    setSchoolId,
    updateExamStatus
  );

// GET /api/exams/:id/results - Get exam results (Admin, Teacher, Student)
router.route("/:id/results").get(protect, setSchoolId, getExamResults); // Authorize removed since its handled in controller
router
  .route("/:id/results")
  .post(protect, authorize("TEACHER"), setSchoolId, submitResults);

// PUT /api/exams/:examId/results/:resultId - Update a specific exam result (Teacher)
router
  .route("/:id/results/:resultId")
  .put(protect, authorize("TEACHER"), setSchoolId, updateExamResult);
router
  .route("/:id/results/:studentId")
  .get(protect, setSchoolId, getStudentExamResult);

// Report card
router.route("/report-card").post(protect, setSchoolId, generateReportCard);
export default router;
