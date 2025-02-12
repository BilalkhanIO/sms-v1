// routes/subjectRoutes.js
import express from "express";
import {
  createSubject,
  assignTeacher,
} from "../controllers/subjectController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();
router.route("/").post(protect, admin, createSubject);

router.route("/:id/teachers").put(protect, admin, assignTeacher);

export default router;
