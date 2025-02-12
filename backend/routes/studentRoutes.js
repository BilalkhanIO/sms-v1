// routes/studentRoutes.js
import express from "express";
import {
  createStudent,
  getStudentsByClass,
} from "../controllers/studentController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();
router.route("/").post(protect, admin, createStudent);

router.route("/class/:classId").get(protect, getStudentsByClass);

export default router;
