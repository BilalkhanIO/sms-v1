// routes/teacherRoutes.js
import express from "express";
import {
  getTeachers,
  updateTeacherStatus,
  getTeacherClasses,
  getTeacherSchedule,
} from "../controllers/teacherController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();
router.route("/").get(protect, admin, getTeachers);

router.route("/:id/status").put(protect, admin, updateTeacherStatus);

router.route("/:id/classes").get(protect, getTeacherClasses);

router.route("/:id/schedule").get(protect, getTeacherSchedule);

export default router;
