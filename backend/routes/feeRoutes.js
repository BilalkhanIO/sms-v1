// routes/feeRoutes.js
import express from "express";
import {
  updateFeePayment,
  getFeesByStudent,
  generateFeeReport,
} from "../controllers/feeController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();
router.route("/student/:studentId").get(protect, getFeesByStudent);

router.route("/:id/pay").put(protect, updateFeePayment);

router.route("/report").get(protect, admin, generateFeeReport);

export default router;
