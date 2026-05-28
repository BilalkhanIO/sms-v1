// controllers/assignmentController.js
import Assignment from "../models/Assignment.js";
import Teacher from "../models/Teacher.js";
import Student from "../models/Student.js";
import Activity from "../models/Activity.js";
import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";
import { sendNotification } from "./notificationController.js";

// @desc    Get all assignments (filtered by class/subject/status)
// @route   GET /api/assignments
// @access  Private (Teacher sees own; Student sees for their class)
const getAssignments = [
  protect,
  authorize("SUPER_ADMIN", "SCHOOL_ADMIN", "TEACHER", "STUDENT"),
  asyncHandler(async (req, res) => {
    const { classId, subject, status } = req.query;
    const query = {};

    if (req.user.role === "TEACHER") {
      const teacher = await Teacher.findOne({ user: req.user._id });
      if (!teacher) {
        return errorResponse(res, "Teacher not found", 404);
      }
      query.assignedBy = teacher._id;
    }

    if (req.user.role === "STUDENT") {
      const student = await Student.findOne({ user: req.user._id });
      if (!student) {
        return errorResponse(res, "Student not found", 404);
      }
      query.class = student.class;
    }

    if (classId) query.class = classId;
    if (subject) query.subject = subject;
    if (status) query.status = status;

    const assignments = await Assignment.find(query)
      .populate("subject", "name code")
      .populate("class", "name section")
      .populate({ path: "assignedBy", select: "employeeId", populate: { path: "user", select: "firstName lastName" } })
      .sort({ dueDate: 1, createdAt: -1 })
      .lean();

    return successResponse(res, assignments, "Assignments retrieved successfully");
  }),
];

// @desc    Get assignment by ID
// @route   GET /api/assignments/:id
// @access  Private (Teacher/Admin: any; Student: only for their class)
const getAssignmentById = [
  protect,
  authorize("SUPER_ADMIN", "SCHOOL_ADMIN", "TEACHER", "STUDENT"),
  asyncHandler(async (req, res) => {
    const assignment = await Assignment.findById(req.params.id)
      .populate("subject", "name code")
      .populate("class", "name section")
      .populate({ path: "assignedBy", select: "employeeId", populate: { path: "user", select: "firstName lastName" } })
      .populate({ path: "submissions.student", select: "admissionNumber rollNumber", populate: { path: "user", select: "firstName lastName" } });

    if (!assignment) {
      return errorResponse(res, "Assignment not found", 404);
    }

    // Students may only view assignments for their enrolled class
    if (req.user.role === "STUDENT") {
      const student = await Student.findOne({ user: req.user._id });
      if (!student) {
        return errorResponse(res, "Student not found", 404);
      }
      if (assignment.class._id.toString() !== student.class.toString()) {
        return errorResponse(res, "Not authorized to view this assignment", 403);
      }
    }

    return successResponse(res, assignment, "Assignment retrieved successfully");
  }),
];

// @desc    Create assignment
// @route   POST /api/assignments
// @access  Private (Teacher, School Admin)
const createAssignment = [
  protect,
  authorize("TEACHER", "SCHOOL_ADMIN"),

  body("title").notEmpty().withMessage("Title is required").trim(),
  body("subject").notEmpty().withMessage("Subject is required").isMongoId().withMessage("Invalid subject ID"),
  body("class").notEmpty().withMessage("Class is required").isMongoId().withMessage("Invalid class ID"),
  body("dueDate").isISO8601().withMessage("Valid due date is required").toDate(),
  body("pointsPossible")
    .notEmpty().withMessage("Points possible is required")
    .isInt({ min: 1 }).withMessage("Points possible must be at least 1"),
  body("description").optional().trim(),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, "Validation failed", 400, errors.array());
    }

    const { title, description, subject, class: classId, dueDate, pointsPossible } = req.body;

    const teacher = await Teacher.findOne({ user: req.user._id });
    if (!teacher && req.user.role === "TEACHER") {
      return errorResponse(res, "Teacher profile not found", 404);
    }

    const assignedBy = teacher ? teacher._id : null;
    if (!assignedBy) {
      return errorResponse(res, "Only teachers can be assigned as the creator of an assignment", 400);
    }

    const assignment = await Assignment.create({
      title,
      description,
      subject,
      class: classId,
      assignedBy,
      dueDate,
      pointsPossible,
      status: "OPEN",
    });

    await Activity.logActivity({
      userId: req.user._id,
      schoolId: req.user.schoolId,
      type: "ASSIGNMENT_CREATED",
      description: `Assignment "${title}" created for class ${classId}`,
      context: "assignment-management",
      metadata: { assignmentId: assignment._id, classId, subject },
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });

    return successResponse(res, assignment, "Assignment created successfully", 201);
  }),
];

// @desc    Update assignment
// @route   PUT /api/assignments/:id
// @access  Private (Creator Teacher or School Admin; cannot update if CLOSED)
const updateAssignment = [
  protect,
  authorize("TEACHER", "SCHOOL_ADMIN", "SUPER_ADMIN"),

  body("title").optional().notEmpty().withMessage("Title cannot be empty").trim(),
  body("dueDate").optional().isISO8601().withMessage("Valid due date required").toDate(),
  body("pointsPossible").optional().isInt({ min: 1 }).withMessage("Points possible must be at least 1"),
  body("status").optional().isIn(["OPEN", "CLOSED", "GRADED"]).withMessage("Invalid status value"),
  body("description").optional().trim(),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, "Validation failed", 400, errors.array());
    }

    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return errorResponse(res, "Assignment not found", 404);
    }

    if (assignment.status === "CLOSED") {
      return errorResponse(res, "Cannot update a closed assignment", 400);
    }

    // Teachers may only update their own assignments
    if (req.user.role === "TEACHER") {
      const teacher = await Teacher.findOne({ user: req.user._id });
      if (!teacher || assignment.assignedBy.toString() !== teacher._id.toString()) {
        return errorResponse(res, "Not authorized to update this assignment", 403);
      }
    }

    const { title, description, subject, class: classId, dueDate, pointsPossible, status } = req.body;

    if (title !== undefined) assignment.title = title;
    if (description !== undefined) assignment.description = description;
    if (subject !== undefined) assignment.subject = subject;
    if (classId !== undefined) assignment.class = classId;
    if (dueDate !== undefined) assignment.dueDate = dueDate;
    if (pointsPossible !== undefined) assignment.pointsPossible = pointsPossible;
    if (status !== undefined) assignment.status = status;

    const updated = await assignment.save();

    return successResponse(res, updated, "Assignment updated successfully");
  }),
];

// @desc    Delete assignment
// @route   DELETE /api/assignments/:id
// @access  Private (Creator Teacher or School Admin)
const deleteAssignment = [
  protect,
  authorize("TEACHER", "SCHOOL_ADMIN", "SUPER_ADMIN"),
  asyncHandler(async (req, res) => {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return errorResponse(res, "Assignment not found", 404);
    }

    if (req.user.role === "TEACHER") {
      const teacher = await Teacher.findOne({ user: req.user._id });
      if (!teacher || assignment.assignedBy.toString() !== teacher._id.toString()) {
        return errorResponse(res, "Not authorized to delete this assignment", 403);
      }
    }

    await Assignment.deleteOne({ _id: assignment._id });

    await Activity.logActivity({
      userId: req.user._id,
      schoolId: req.user.schoolId,
      type: "OTHER",
      description: `Assignment "${assignment.title}" deleted`,
      context: "assignment-management",
      metadata: { assignmentId: assignment._id },
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });

    return successResponse(res, null, "Assignment deleted successfully");
  }),
];

// @desc    Submit assignment (student)
// @route   POST /api/assignments/:id/submit
// @access  Private (Student only)
const submitAssignment = [
  protect,
  authorize("STUDENT"),

  body("fileUrl").notEmpty().withMessage("File URL is required").isURL().withMessage("Must be a valid URL"),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, "Validation failed", 400, errors.array());
    }

    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return errorResponse(res, "Assignment not found", 404);
    }

    if (assignment.status === "CLOSED" || assignment.status === "GRADED") {
      return errorResponse(res, "This assignment is no longer accepting submissions", 400);
    }

    if (new Date() > new Date(assignment.dueDate)) {
      return errorResponse(res, "The due date for this assignment has passed", 400);
    }

    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
      return errorResponse(res, "Student not found", 404);
    }

    // Verify the student belongs to the assignment's class
    if (assignment.class.toString() !== student.class.toString()) {
      return errorResponse(res, "You are not enrolled in the class this assignment belongs to", 403);
    }

    // Check if already submitted
    const existingSubmission = assignment.submissions.find(
      (s) => s.student.toString() === student._id.toString()
    );
    if (existingSubmission) {
      return errorResponse(res, "You have already submitted this assignment", 409);
    }

    assignment.submissions.push({
      student: student._id,
      fileUrl: req.body.fileUrl,
      submittedAt: new Date(),
    });

    await assignment.save();

    await Activity.logActivity({
      userId: req.user._id,
      schoolId: req.user.schoolId,
      type: "ASSIGNMENT_SUBMITTED",
      description: `Student submitted assignment "${assignment.title}"`,
      context: "assignment-management",
      metadata: { assignmentId: assignment._id, studentId: student._id },
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });

    // Notify the teacher that a new submission has arrived
    try {
      const teacher = await Teacher.findById(assignment.assignedBy).populate("user", "_id");
      if (teacher && teacher.user) {
        await sendNotification(
          teacher.user._id,
          `A student submitted the assignment "${assignment.title}"`,
          "INFO",
          `/assignments/${assignment._id}`
        );
      }
    } catch (notifErr) {
      console.error("Failed to send submission notification:", notifErr);
    }

    return successResponse(res, assignment, "Assignment submitted successfully");
  }),
];

// @desc    Grade a student's submission
// @route   PUT /api/assignments/:id/grade/:studentId
// @access  Private (Teacher who created the assignment)
const gradeSubmission = [
  protect,
  authorize("TEACHER", "SCHOOL_ADMIN", "SUPER_ADMIN"),

  body("grade")
    .notEmpty().withMessage("Grade is required")
    .isNumeric().withMessage("Grade must be a number")
    .custom((value, { req: expressReq }) => {
      if (parseFloat(value) < 0) throw new Error("Grade cannot be negative");
      return true;
    }),
  body("feedback").notEmpty().withMessage("Feedback is required when grading").trim(),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, "Validation failed", 400, errors.array());
    }

    const { id: assignmentId, studentId } = req.params;
    const { grade, feedback } = req.body;

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return errorResponse(res, "Assignment not found", 404);
    }

    if (req.user.role === "TEACHER") {
      const teacher = await Teacher.findOne({ user: req.user._id });
      if (!teacher || assignment.assignedBy.toString() !== teacher._id.toString()) {
        return errorResponse(res, "Not authorized to grade this assignment", 403);
      }
    }

    // Find the student's submission
    const submission = assignment.submissions.find(
      (s) => s.student.toString() === studentId
    );
    if (!submission) {
      return errorResponse(res, "Submission not found for this student", 404);
    }

    if (grade > assignment.pointsPossible) {
      return errorResponse(
        res,
        `Grade cannot exceed the maximum points (${assignment.pointsPossible})`,
        400
      );
    }

    submission.grade = parseFloat(grade);
    submission.feedback = feedback;

    // Mark entire assignment as GRADED when every submitted student has been graded
    const allGraded = assignment.submissions.every((s) => s.grade !== undefined);
    if (allGraded && assignment.submissions.length > 0) {
      assignment.status = "GRADED";
    }

    await assignment.save();

    // Notify the student that their submission has been graded
    try {
      const student = await Student.findById(studentId).populate("user", "_id");
      if (student && student.user) {
        await sendNotification(
          student.user._id,
          `Your submission for "${assignment.title}" has been graded. Grade: ${grade}/${assignment.pointsPossible}`,
          "INFO",
          `/assignments/${assignment._id}`
        );
      }
    } catch (notifErr) {
      console.error("Failed to send grading notification:", notifErr);
    }

    return successResponse(res, assignment, "Submission graded successfully");
  }),
];

// @desc    Get pending/overdue assignments for the logged-in student
// @route   GET /api/assignments/my
// @access  Private (Student only)
const getMyAssignments = [
  protect,
  authorize("STUDENT"),
  asyncHandler(async (req, res) => {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
      return errorResponse(res, "Student not found", 404);
    }

    const now = new Date();

    // All open assignments for the student's class
    const assignments = await Assignment.find({
      class: student.class,
      status: "OPEN",
    })
      .populate("subject", "name code")
      .populate("class", "name section")
      .populate({ path: "assignedBy", select: "employeeId", populate: { path: "user", select: "firstName lastName" } })
      .sort({ dueDate: 1 })
      .lean();

    // Tag each assignment as pending or overdue based on submission state
    const result = assignments.map((assignment) => {
      const hasSubmitted = assignment.submissions.some(
        (s) => s.student.toString() === student._id.toString()
      );
      const isOverdue = new Date(assignment.dueDate) < now;

      return {
        ...assignment,
        submissionStatus: hasSubmitted ? "SUBMITTED" : isOverdue ? "OVERDUE" : "PENDING",
      };
    });

    return successResponse(res, result, "My assignments retrieved successfully");
  }),
];

export {
  getAssignments,
  getAssignmentById,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  submitAssignment,
  gradeSubmission,
  getMyAssignments,
};
