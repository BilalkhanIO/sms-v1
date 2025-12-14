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
import { setSchoolId } from "../middleware/schoolMiddleware.js";

const router = express.Router();

// GET /api/fees - Get all fees (Admin only)
// POST /api/fees - Create a new fee record (Admin only)
router
  .route("/")
  .get(protect, authorize("SUPER_ADMIN", "SCHOOL_ADMIN"), setSchoolId, getFees)
  .post(
    protect,
    authorize("SUPER_ADMIN", "SCHOOL_ADMIN"),
    setSchoolId,
    createFee
  );

// GET /api/fees/student/:studentId - Get fees by student (Admin, Student, Parent)
router
  .route("/student/:studentId")
  .get(protect, setSchoolId, getFeesByStudent); //Removed redundant authorize
router
  .route("/class/:classId")
  .get(
    protect,
    authorize("SUPER_ADMIN", "SCHOOL_ADMIN"),
    setSchoolId,
    getFeesByClass
  );
router
  .route("/payment")
  .post(
    protect,
    authorize("SUPER_ADMIN", "SCHOOL_ADMIN"),
    setSchoolId,
    recordPayment
  );
router
  .route("/payment-history/:studentId")
  .get(protect, setSchoolId, getPaymentHistory);

// PUT /api/fees/:id/pay - Update fee payment (Admin)
router
  .route("/:id/pay")
  .put(
    protect,
    authorize("SUPER_ADMIN", "SCHOOL_ADMIN"),
    setSchoolId,
    updateFeePayment
  );

// GET /api/fees/report - Generate fee report (Admin only)
router
  .route("/report")
  .get(
    protect,
    authorize("SUPER_ADMIN", "SCHOOL_ADMIN"),
    setSchoolId,
    generateFeeReport
  );

// PUT /api/fees/:id - Update a fee record (Admin only)
// DELETE /api/fees/:id - Delete a fee record (Admin only)
router
  .route("/:id")
  .get(
    protect,
    authorize("SUPER_ADMIN", "SCHOOL_ADMIN"),
    setSchoolId,
    getFeeById
  )
  .put(
    protect,
    authorize("SUPER_ADMIN", "SCHOOL_ADMIN"),
    setSchoolId,
    updateFee
  )
  .delete(
    protect,
    authorize("SUPER_ADMIN", "SCHOOL_ADMIN"),
    setSchoolId,
    deleteFee
  );

router
  .route("/:id/invoice")
  .post(
    protect,
    authorize("SUPER_ADMIN", "SCHOOL_ADMIN"),
    setSchoolId,
    generateInvoice
  );

export default router;
