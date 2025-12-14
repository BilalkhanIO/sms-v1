// routes/feeRoutes.js
import express from "express";
import {
  updateFeePayment,
  getFees,
  getFeesByStudent,
  generateFeeReport,
  createFee,
  updateFee,
  deleteFee,
  getFeeById,
  getFeesByClass,
  recordPayment,
  getPaymentHistory,
  generateInvoice,
} from "../controllers/feeController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/fees - Get all fees (Admin only)
// POST /api/fees - Create a new fee record (Admin only)
router
  .route("/")
  .get(protect, authorize("SUPER_ADMIN", "SCHOOL_ADMIN"), getFees)
  .post(protect, authorize("SUPER_ADMIN", "SCHOOL_ADMIN"), createFee);

// GET /api/fees/student/:studentId - Get fees by student (Admin, Student, Parent)
router.route("/student/:studentId").get(protect, getFeesByStudent); //Removed redundant authorize
router.route("/class/:classId").get(protect, authorize("SUPER_ADMIN", "SCHOOL_ADMIN"), getFeesByClass);
router.route("/payment").post(protect, authorize("SUPER_ADMIN", "SCHOOL_ADMIN"), recordPayment);
router.route("/payment-history/:studentId").get(protect, getPaymentHistory);

// PUT /api/fees/:id/pay - Update fee payment (Admin)
router
  .route("/:id/pay")
  .put(protect, authorize("SUPER_ADMIN", "SCHOOL_ADMIN"), updateFeePayment);

// GET /api/fees/report - Generate fee report (Admin only)
router
  .route("/report")
  .get(protect, authorize("SUPER_ADMIN", "SCHOOL_ADMIN"), generateFeeReport);

// PUT /api/fees/:id - Update a fee record (Admin only)
// DELETE /api/fees/:id - Delete a fee record (Admin only)
router
  .route("/:id")
  .get(protect, authorize("SUPER_ADMIN", "SCHOOL_ADMIN"), getFeeById)
  .put(protect, authorize("SUPER_ADMIN", "SCHOOL_ADMIN"), updateFee)
  .delete(protect, authorize("SUPER_ADMIN", "SCHOOL_ADMIN"), deleteFee);

router.route("/:id/invoice").post(protect, authorize("SUPER_ADMIN", "SCHOOL_ADMIN"), generateInvoice);

export default router;
