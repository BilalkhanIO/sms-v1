// controllers/leaveController.js
import LeaveRequest from "../models/LeaveRequest.js";
import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

// @desc    Get leave requests
//          - SCHOOL_ADMIN/SUPER_ADMIN sees all for the school
//          - Other users see only their own requests
// @route   GET /api/leaves
// @access  Private
const getLeaveRequests = [
  protect,
  asyncHandler(async (req, res) => {
    const { status, leaveType, applicantType, page = 1, limit = 20 } = req.query;

    const query = { school: req.schoolId };

    if (req.user.role !== "SCHOOL_ADMIN" && req.user.role !== "SUPER_ADMIN") {
      query.applicant = req.user._id;
    }

    if (status) query.status = status;
    if (leaveType) query.leaveType = leaveType;
    if (applicantType) query.applicantType = applicantType;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await LeaveRequest.countDocuments(query);
    const leaves = await LeaveRequest.find(query)
      .populate("applicant", "firstName lastName email role")
      .populate("reviewedBy", "firstName lastName")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    return successResponse(
      res,
      { leaves, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) },
      "Leave requests retrieved successfully"
    );
  }),
];

// @desc    Get a single leave request by ID
// @route   GET /api/leaves/:id
// @access  Private
const getLeaveById = [
  protect,
  asyncHandler(async (req, res) => {
    const leave = await LeaveRequest.findOne({
      _id: req.params.id,
      school: req.schoolId,
    })
      .populate("applicant", "firstName lastName email role")
      .populate("reviewedBy", "firstName lastName")
      .lean();

    if (!leave) {
      return errorResponse(res, "Leave request not found", 404);
    }

    // Non-admins may only view their own leave request
    if (
      req.user.role !== "SCHOOL_ADMIN" &&
      req.user.role !== "SUPER_ADMIN" &&
      leave.applicant._id.toString() !== req.user._id.toString()
    ) {
      return errorResponse(res, "Not authorized to view this leave request", 403);
    }

    return successResponse(res, leave, "Leave request retrieved successfully");
  }),
];

// @desc    Create a new leave request
// @route   POST /api/leaves
// @access  Private (any authenticated user)
const createLeaveRequest = [
  protect,

  body("leaveType")
    .notEmpty()
    .withMessage("Leave type is required")
    .isIn(["SICK", "CASUAL", "MATERNITY", "PATERNITY", "EMERGENCY", "UNPAID", "OTHER"])
    .withMessage("Invalid leave type"),
  body("startDate").isISO8601().withMessage("Valid start date is required").toDate(),
  body("endDate").isISO8601().withMessage("Valid end date is required").toDate(),
  body("reason").notEmpty().withMessage("Reason is required").trim(),
  body("applicantType")
    .notEmpty()
    .withMessage("Applicant type is required")
    .isIn(["TEACHER", "STUDENT", "STAFF"])
    .withMessage("Invalid applicant type"),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, "Validation failed", 400, errors.array());
    }

    const { leaveType, startDate, endDate, reason, applicantType, attachmentUrl } = req.body;

    if (new Date(endDate) < new Date(startDate)) {
      return errorResponse(res, "End date cannot be before start date", 400);
    }

    const leave = await LeaveRequest.create({
      applicant: req.user._id,
      applicantType,
      leaveType,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      reason,
      attachmentUrl,
      school: req.schoolId,
      status: "PENDING",
    });

    return successResponse(res, leave, "Leave request submitted successfully", 201);
  }),
];

// @desc    Update a leave request
//          - SCHOOL_ADMIN/SUPER_ADMIN can approve or reject
//          - Applicant can cancel their own PENDING request
// @route   PUT /api/leaves/:id
// @access  Private
const updateLeaveRequest = [
  protect,

  asyncHandler(async (req, res) => {
    const leave = await LeaveRequest.findOne({
      _id: req.params.id,
      school: req.schoolId,
    });

    if (!leave) {
      return errorResponse(res, "Leave request not found", 404);
    }

    const isAdmin =
      req.user.role === "SCHOOL_ADMIN" || req.user.role === "SUPER_ADMIN";
    const isApplicant = leave.applicant.toString() === req.user._id.toString();

    if (!isAdmin && !isApplicant) {
      return errorResponse(res, "Not authorized to update this leave request", 403);
    }

    if (isAdmin) {
      const { status, reviewNotes } = req.body;

      if (!status || !["APPROVED", "REJECTED"].includes(status)) {
        return errorResponse(res, "Status must be APPROVED or REJECTED", 400);
      }

      leave.status = status;
      leave.reviewedBy = req.user._id;
      leave.reviewedAt = new Date();
      if (reviewNotes !== undefined) leave.reviewNotes = reviewNotes;
    } else {
      // Applicant can only cancel a PENDING request
      if (leave.status !== "PENDING") {
        return errorResponse(
          res,
          "Only PENDING leave requests can be cancelled",
          400
        );
      }
      leave.status = "CANCELLED";
    }

    const updated = await leave.save();
    return successResponse(res, updated, "Leave request updated successfully");
  }),
];

// @desc    Delete a leave request (only if PENDING)
// @route   DELETE /api/leaves/:id
// @access  Private
const deleteLeaveRequest = [
  protect,

  asyncHandler(async (req, res) => {
    const leave = await LeaveRequest.findOne({
      _id: req.params.id,
      school: req.schoolId,
    });

    if (!leave) {
      return errorResponse(res, "Leave request not found", 404);
    }

    const isAdmin =
      req.user.role === "SCHOOL_ADMIN" || req.user.role === "SUPER_ADMIN";
    const isApplicant = leave.applicant.toString() === req.user._id.toString();

    if (!isAdmin && !isApplicant) {
      return errorResponse(res, "Not authorized to delete this leave request", 403);
    }

    if (leave.status !== "PENDING") {
      return errorResponse(res, "Only PENDING leave requests can be deleted", 400);
    }

    await LeaveRequest.deleteOne({ _id: leave._id });
    return successResponse(res, null, "Leave request deleted successfully");
  }),
];

export {
  getLeaveRequests,
  getLeaveById,
  createLeaveRequest,
  updateLeaveRequest,
  deleteLeaveRequest,
};
