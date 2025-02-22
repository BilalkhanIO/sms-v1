// controllers/feeController.js
import Fee from "../models/Fee.js";
import asyncHandler from "express-async-handler";
import Activity from "../models/Activity.js";
import Student from "../models/Student.js";
import { body, validationResult } from "express-validator";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

// @desc    Get fees by student
// @route   GET /api/fees/student/:studentId
// @access  Private (Admin, Student, Parent)
const getFeesByStudent = [
  protect,
  asyncHandler(async (req, res) => {
    const studentId = req.params.studentId;
    const student = await Student.findById(studentId);

    if (!student) {
      return errorResponse(res, "Student not found", 404);
    }
    // Authorization check
    if (
      req.user.role !== "SUPER_ADMIN" &&
      req.user.role !== "SCHOOL_ADMIN" &&
      !(
        req.user.role === "STUDENT" &&
        req.user._id.toString() === student.user.toString()
      ) &&
      !(
        req.user.role === "PARENT" &&
        student.parentInfo.guardian.equals(req.user._id)
      )
    ) {
      return errorResponse(
        res,
        "Not authorized to view this student fees",
        403
      );
    }

    const fees = await Fee.find({ student: studentId })
      .populate("student", "admissionNumber")
      .populate("createdBy", "firstName lastName")
      .sort("-dueDate"); // Sort by due date (descending)
    return successResponse(res, fees, "Fees retrieved successfully");
  }),
];

// @desc    Generate fee report
// @route   GET /api/fees/report
// @access  Private/Admin
const generateFeeReport = [
  protect,
  authorize("SUPER_ADMIN", "SCHOOL_ADMIN"),
  asyncHandler(async (req, res) => {
    const { startDate, endDate, status, studentId, type } = req.query;

    const filter = {};

    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }
    if (status) filter.status = status;
    if (studentId) filter.student = studentId;
    if (type) filter.type = type;

    const report = await Fee.aggregate([
      { $match: filter },
      {
        $group: {
          _id: "$type", // Group by fee type
          totalAmount: { $sum: "$amount" }, // Sum of total amounts
          totalPaid: { $sum: "$paidAmount" }, // Sum of paid amounts
          totalPending: { $sum: { $subtract: ["$amount", "$paidAmount"] } }, // Calculate total pending
          count: { $sum: 1 }, // Count of fee records
          students: { $addToSet: "$student" }, // Get unique students
        },
      },
      {
        $project: {
          _id: 1,
          totalAmount: 1,
          totalPaid: 1,
          totalPending: 1,
          count: 1,
          uniqueStudents: { $size: "$students" }, // Count of unique students
        },
      },
    ]);
    return successResponse(res, report, "Fee report generated successfully");
  }),
];

// @desc    Update fee payment
// @route   PUT /api/fees/:id/pay
// @access  Private/Admin
const updateFeePayment = [
  protect,
  authorize("SUPER_ADMIN", "SCHOOL_ADMIN"),

  // Validation
  body("amountPaid")
    .isNumeric()
    .withMessage("Amount paid must be a number")
    .toFloat(),
  body("paymentMethod")
    .isIn(["CASH", "ONLINE", "CHEQUE", "BANK_TRANSFER"])
    .withMessage("Invalid payment method"),
  body("transactionId")
    .optional()
    .notEmpty()
    .withMessage("Transaction ID cannot be empty if provided"),
  body("receiptNumber")
    .optional()
    .notEmpty()
    .withMessage("Receipt number cannot be empty if provided"),
  body("paidDate")
    .optional()
    .isISO8601()
    .withMessage("Invalid paid date")
    .toDate(),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, "Validation failed", 400, errors.array());
    }

    const {
      amountPaid,
      paymentMethod,
      transactionId,
      receiptNumber,
      paidDate,
    } = req.body;
    const fee = await Fee.findById(req.params.id);

    if (!fee) {
      return errorResponse(res, "Fee record not found", 404);
    }

    if (fee.status === "PAID") {
      return errorResponse(res, "Fee is already fully paid", 400);
    }

    const updatedPaidAmount = fee.paidAmount + amountPaid;
    if (updatedPaidAmount > fee.amount) {
      return errorResponse(res, "Paid amount cannot exceed total amount", 400);
    }

    const updateData = {
      paidAmount: updatedPaidAmount,
      paymentMethod: paymentMethod || fee.paymentMethod,
      transactionId: transactionId || fee.transactionId, // Allow updating
      receiptNumber: receiptNumber || fee.receiptNumber, // Allow updating
      paidDate: paidDate || new Date(), // Allow updating, but default to now
    };

    // Update the status based on paid amount
    if (updateData.paidAmount >= fee.amount) {
      updateData.status = "PAID";
    } else if (updateData.paidAmount > 0) {
      updateData.status = "PARTIAL";
    }

    const updatedFee = await Fee.findOneAndUpdate(
      { _id: req.params.id },
      updateData,
      { new: true, runValidators: true }
    );

    // Log activity
    await Activity.logActivity({
      userId: req.user._id,
      type: "FEE_PAID",
      description: `Payment of ${amountPaid} recorded for fee ${fee._id}`,
      context: "fee-management", // Added context
      metadata: {
        feeId: fee._id,
        studentId: fee.student,
        amountPaid,
        paymentMethod,
      },
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });
    return successResponse(res, updatedFee, "Fee payment updated successfully");
  }),
];

// @desc    Create new fee record
// @route   POST /api/fees
// @access  Private/Admin
const createFee = [
  protect,
  authorize("SUPER_ADMIN", "SCHOOL_ADMIN"),

  // Validation rules
  body("student")
    .notEmpty()
    .withMessage("Student is required")
    .isMongoId()
    .withMessage("Invalid Student ID"),
  body("amount").isNumeric().withMessage("Amount must be a number").toFloat(),
  body("type")
    .isIn([
      "TUITION",
      "TRANSPORT",
      "LIBRARY",
      "LABORATORY",
      "SPORTS",
      "OTHER",
      "ANNOUNCEMENT",
    ])
    .withMessage("Invalid fee type"),
  body("dueDate").isISO8601().withMessage("Invalid due date").toDate(),
  body("academicYear").notEmpty().withMessage("Academic year is required"),
  body("term").notEmpty().withMessage("Term is required"),
  body("description").optional(),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, "Validation failed", 400, errors.array());
    }

    const { student, amount, type, dueDate, academicYear, term, description } =
      req.body;

    const studentExist = await Student.findById(student);
    if (!studentExist) {
      return errorResponse(res, "Student not found", 404);
    }

    const fee = await Fee.create({
      student,
      amount,
      type,
      dueDate,
      academicYear,
      term,
      description,
      createdBy: req.user._id, // Associate with creating user
      updatedBy: req.user._id, // Initially, updated by the same user
    });

    // Log activity
    await Activity.logActivity({
      userId: req.user._id,
      type: "FEE_CREATED",
      description: `Created fee record for student ${student} of amount ${amount}`,
      context: "fee-management", // Added context
      metadata: { feeId: fee._id, studentId: student },
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });
    return successResponse(res, fee, "Fee record created successfully", 201);
  }),
];

// @desc    Update fee record (Admin only)
// @route   PUT /api/fees/:id
// @access  Private/Admin
const updateFee = [
  protect,
  authorize("SUPER_ADMIN", "SCHOOL_ADMIN"),

  // Validation (allow optional updates)
  body("amount")
    .optional()
    .isNumeric()
    .withMessage("Amount must be a number")
    .toFloat(),
  body("type")
    .optional()
    .isIn([
      "TUITION",
      "TRANSPORT",
      "LIBRARY",
      "LABORATORY",
      "SPORTS",
      "OTHER",
      "ANNOUNCEMENT",
    ])
    .withMessage("Invalid fee type"),
  body("dueDate")
    .optional()
    .isISO8601()
    .withMessage("Invalid due date")
    .toDate(),
  body("academicYear")
    .optional()
    .notEmpty()
    .withMessage("Academic year is required"),
  body("term").optional().notEmpty().withMessage("Term is required"),
  body("description").optional(),
  body("status")
    .optional()
    .isIn(["PENDING", "PAID", "OVERDUE", "PARTIAL"])
    .withMessage("Invalid Status"),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, "Validation failed", 400, errors.array());
    }

    const fee = await Fee.findById(req.params.id);

    if (!fee) {
      return errorResponse(res, "Fee record not found", 404);
    }

    const { amount, type, dueDate, academicYear, term, description, status } =
      req.body;
    const updateData = {
      amount: amount || fee.amount,
      type: type || fee.type,
      dueDate: dueDate || fee.dueDate,
      academicYear: academicYear || fee.academicYear,
      term: term || fee.term,
      description: description || fee.description,
      status: status || fee.status,
      updatedBy: req.user._id, // Always update the 'updatedBy' field
    };
    // Find and update
    const updatedFee = await Fee.findOneAndUpdate(
      { _id: req.params.id },
      updateData,
      { new: true, runValidators: true }
    );

    // Log activity
    await Activity.logActivity({
      userId: req.user._id,
      type: "FEE_UPDATED",
      description: `Updated fee record for fee ${fee._id}`,
      context: "fee-management", // Added context
      metadata: { feeId: fee._id, studentId: fee.student },
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });
    return successResponse(res, updatedFee, "Fee record updated successfully");
  }),
];

// @desc    Delete fee record (Admin only)
// @route   DELETE /api/fees/:id
// @access  Private/Admin
const deleteFee = [
  protect,
  authorize("SUPER_ADMIN", "SCHOOL_ADMIN"),
  asyncHandler(async (req, res) => {
    const fee = await Fee.findById(req.params.id);

    if (!fee) {
      return errorResponse(res, "Fee record not found", 404);
    }

    if (fee.status === "PAID" || fee.status === "PARTIAL") {
      return errorResponse(
        res,
        "Cannot delete a fee record with PAID or PARTIAL status",
        400
      );
    }

    await Fee.deleteOne({ _id: req.params.id });

    // Log activity
    await Activity.logActivity({
      userId: req.user._id,
      type: "FEE_DELETED",
      description: `Deleted fee record for fee ${fee._id}`,
      context: "fee-management", // Added context
      metadata: { feeId: fee._id, studentId: fee.student },
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });
    return successResponse(res, null, "Fee record removed");
  }),
];

export {
  updateFeePayment,
  getFeesByStudent,
  generateFeeReport,
  createFee,
  updateFee,
  deleteFee,
};
