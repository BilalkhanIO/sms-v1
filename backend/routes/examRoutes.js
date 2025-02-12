// routes/examRoutes.js
import express from "express";
import {
  createExam,
  addExamResult,
  updateExamStatus,
  getExamResults,
} from "../controllers/examController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();
router.route("/").post(protect, createExam);

router.route("/:id/status").put(protect, updateExamStatus);

router
  .route("/:id/results")
  .post(protect, addExamResult)
  .get(protect, getExamResults);

export default router;
