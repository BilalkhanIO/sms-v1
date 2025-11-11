// controllers/subjectController.js
import Subject from "../models/Subject.js";
import ClassModel from "../models/Class.js";
import Teacher from "../models/Teacher.js";
import asyncHandler from "express-async-handler";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";
import Activity from "../models/Activity.js";
import { body, validationResult } from "express-validator";
// @desc    Create new subject
// @route   POST /api/subjects
// @access  Private/Admin
const createSubject = [
  protect,
  authorize("SUPER_ADMIN", "SCHOOL_ADMIN"),

  // Validation rules
  body("name").notEmpty().withMessage("Subject name is required"),
  body("code").notEmpty().withMessage("Subject code is required"),
  body("description").optional(),
  body("credits").isNumeric().withMessage("Credits must be a number"),
  body("type")
    .optional()
    .isIn(["MANDATORY", "ELECTIVE"])
    .withMessage("Invalid subject type"),
  body("syllabus")
    .optional()
    .isArray()
    .withMessage("Syllabus must be an array"),
  body("assignedTeachers")
    .optional()
    .isArray()
    .withMessage("Assigned teachers must be an array"),
  body("assignedClasses")
    .optional()
    .isArray()
    .withMessage("Assigned classes must be an array"),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, "Validation failed", 400, errors.array());
    }
    const {
      code,
      name,
      description,
      credits,
      type,
      syllabus,
      assignedTeachers,
      assignedClasses,
    } = req.body;

    // Check for duplicate subject code
    const existingSubject = await Subject.findOne({ code });
    if (existingSubject) {
      return errorResponse(res, "Subject code already exists", 400);
    }

    // Create the subject
    const subject = await Subject.create({
      code,
      name,
      description,
      credits,
      type,
      syllabus,
      assignedTeachers,
      assignedClasses,
    });
    // Log activity
    await Activity.logActivity({
      userId: req.user._id,
      type: "SUBJECT_CREATED",
      description: `Created subject ${subject.name} (${subject.code})`,
      context: "subject-management", // Added context
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });
    return successResponse(res, subject, "Subject created successfully", 201);
  }),
];

// @desc    Get all subjects
// @route   GET /api/subjects
// @access  Private (Admin, Teacher, Student)
const getSubjects = [
  protect,
  authorize("SUPER_ADMIN", "SCHOOL_ADMIN", "TEACHER", "STUDENT"),
  asyncHandler(async (req, res) => {
    let query = {};

    if (req.user.role === "TEACHER") {
      const teacher = await Teacher.findOne({ user: req.user._id });
      query = { assignedTeachers: teacher?._id };
    }

    if (req.user.role === "STUDENT") {
      // Student's class lookup
      const student = await (await import("../models/Student.js")).default.findOne({ user: req.user._id });
      query = { assignedClasses: student?.class };
    }

    const subjects = await Subject.find(query)
      .populate("assignedTeachers", "firstName lastName")
      .populate("assignedClasses", "name section");

    return successResponse(res, subjects, "Subjects retrieved successfully");
  }),
];

// @desc Get subjects by class
// @route GET /api/subjects/class/:classId
// @access Private (Admin, Teacher, Student)
const getSubjectsByClass = [
  protect,
  authorize("SUPER_ADMIN", "SCHOOL_ADMIN", "TEACHER", "STUDENT"),
  asyncHandler(async (req, res) => {
    const { classId } = req.params;
    const classDoc = await ClassModel.findById(classId);
    if (!classDoc) return errorResponse(res, "Class not found", 404);
    const subjects = await Subject.find({ assignedClasses: classId })
      .populate("assignedTeachers", "firstName lastName")
      .populate("assignedClasses", "name section");
    return successResponse(res, subjects, "Subjects retrieved successfully");
  }),
];

// @desc Get subjects by teacher
// @route GET /api/subjects/teacher/:teacherId
// @access Private (Admin, Teacher)
const getSubjectsByTeacher = [
  protect,
  authorize("SUPER_ADMIN", "SCHOOL_ADMIN", "TEACHER"),
  asyncHandler(async (req, res) => {
    const { teacherId } = req.params;
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) return errorResponse(res, "Teacher not found", 404);
    const subjects = await Subject.find({ assignedTeachers: teacherId })
      .populate("assignedTeachers", "firstName lastName")
      .populate("assignedClasses", "name section");
    return successResponse(res, subjects, "Subjects retrieved successfully");
  }),
];

// @desc Assign a teacher to a subject
// @route POST /api/subjects/:id/assign-teacher
// @access Private/Admin
const assignTeacher = [
  protect,
  authorize("SUPER_ADMIN", "SCHOOL_ADMIN"),
  asyncHandler(async (req, res) => {
    const { id } = req.params; // subject id
    const { teacherId } = req.body;
    const subject = await Subject.findById(id);
    if (!subject) return errorResponse(res, "Subject not found", 404);
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) return errorResponse(res, "Teacher not found", 404);
    if (!subject.assignedTeachers.includes(teacherId)) {
      subject.assignedTeachers.push(teacherId);
      await subject.save();
    }
    await Activity.logActivity({
      userId: req.user._id,
      type: "SUBJECT_UPDATED",
      description: `Assigned teacher to subject ${subject.name}`,
      context: "subject-management",
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });
    return successResponse(res, subject, "Teacher assigned successfully");
  }),
];

// @desc Get subject by ID
// @route GET /api/subjects/:id
// @access Private (Admin, Teacher, Student)
const getSubjectById = [
  protect,
  authorize("SUPER_ADMIN", "SCHOOL_ADMIN", "TEACHER", "STUDENT"),
  asyncHandler(async (req, res) => {
    const subjectId = req.params.id;
    const subject = await Subject.findById(subjectId)
      .populate("assignedTeachers", "firstName lastName")
      .populate("assignedClasses", "name section");
    if (!subject) {
      return errorResponse(res, "Subject not found", 404);
    }
    if (
      req.user.role === "TEACHER" &&
      !subject.assignedTeachers.some((teacher) =>
        teacher._id.equals(req.user._id)
      )
    ) {
      return errorResponse(res, "Unauthorized to access this subject", 403);
    }
    if (
      req.user.role === "STUDENT" &&
      !subject.assignedClasses.some((classEl) =>
        classEl._id.equals(req.user.class)
      )
    ) {
      return errorResponse(res, "Not authorized to access this subject", 403);
    }
    return successResponse(res, subject, "Subject retrieved successfully");
  }),
];

// @desc    Update subject
// @route   PUT /api/subjects/:id
// @access  Private/Admin
const updateSubject = [
  protect,
  authorize("SUPER_ADMIN", "SCHOOL_ADMIN"),

  // Validation (allow optional updates)
  body("name").optional().notEmpty().withMessage("Subject name is required"),
  body("code").optional().notEmpty().withMessage("Subject code is required"),
  body("description").optional(),
  body("credits")
    .optional()
    .isNumeric()
    .withMessage("Credits must be a number"),
  body("type")
    .optional()
    .isIn(["MANDATORY", "ELECTIVE"])
    .withMessage("Invalid subject type"),
  body("syllabus")
    .optional()
    .isArray()
    .withMessage("Syllabus must be an array"),
  body("assignedTeachers")
    .optional()
    .isArray()
    .withMessage("Assigned teachers must be an array"),
  body("assignedClasses")
    .optional()
    .isArray()
    .withMessage("Assigned classes must be an array"),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, "Validation failed", 400, errors.array());
    }

    const {
      code,
      name,
      description,
      credits,
      type,
      syllabus,
      assignedTeachers,
      assignedClasses,
    } = req.body;
    const subject = await Subject.findById(req.params.id);

    if (!subject) {
      return errorResponse(res, "Subject not found", 404);
    }

    // Check if the updated code is already in use by another subject
    if (code && code !== subject.code) {
      const existingSubject = await Subject.findOne({ code });
      if (existingSubject) {
        return errorResponse(res, "Subject code already exists", 400);
      }
    }
    const updatedData = {
      code: code || subject.code,
      name: name || subject.name,
      description: description || subject.description,
      credits: credits || subject.credits,
      type: type || subject.type,
      syllabus: syllabus || subject.syllabus,
      assignedTeachers: assignedTeachers || subject.assignedTeachers,
      assignedClasses: assignedClasses || subject.assignedClasses,
    };

    // Find and update the subject
    const updatedSubject = await Subject.findOneAndUpdate(
      { _id: req.params.id },
      updatedData,
      { new: true, runValidators: true } // Return updated and run validations
    );

    // Log activity
    await Activity.logActivity({
      userId: req.user._id,
      type: "SUBJECT_UPDATED",
      description: `Updated subject ${updatedSubject.name} (${updatedSubject.code})`,
      context: "subject-management", // Added context
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });
    return successResponse(res, updatedSubject, "Subject updated successfully");
  }),
];

// @desc    Delete subject
// @route   DELETE /api/subjects/:id
// @access  Private/Admin
const deleteSubject = [
  protect,
  authorize("SUPER_ADMIN", "SCHOOL_ADMIN"),
  asyncHandler(async (req, res) => {
    const subject = await Subject.findById(req.params.id);
    if (!subject) {
      return errorResponse(res, "Subject not found", 404);
    }

    // Delete the subject
    await Subject.deleteOne({ _id: req.params.id });
    // Log activity
    await Activity.logActivity({
      userId: req.user._id,
      type: "SUBJECT_DELETED",
      description: `Deleted subject ${subject.name} (${subject.code})`,
      context: "subject-management", // Added context
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });
    return successResponse(res, null, "Subject deleted successfully");
  }),
];

export {
  createSubject,
  getSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
  getSubjectsByClass,
  getSubjectsByTeacher,
  assignTeacher,
};
