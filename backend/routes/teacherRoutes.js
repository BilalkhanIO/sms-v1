// routes/teacherRoutes.js
import express from "express";
import {
  getTeachers,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  updateTeacherStatus,
  getTeacherClasses,
  getTeacherSchedule,
  assignTeacherToClass,
  assignSubjectToTeacher
} from "../controllers/teacherController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .get(protect, admin, getTeachers)
  .post(protect, admin, createTeacher); // Add create route

router
  .route("/:id")
  .put(protect, admin, updateTeacher) // Add update route
  .delete(protect, admin, deleteTeacher); // Add delete route

router.route("/:id/status").put(protect, admin, updateTeacherStatus);
router.route("/:id/classes").get(protect, getTeacherClasses);
router.route("/:id/schedule").get(protect, getTeacherSchedule);
router.route("/:id/assign-class").put(protect, admin, assignTeacherToClass);
router.route("/:id/assign-subject").put(protect, admin, assignSubjectToTeacher);

export default router;
