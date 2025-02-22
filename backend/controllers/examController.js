// controllers/examController.js
import Exam from "../models/Exam.js";
import Result from "../models/Result.js";
import asyncHandler from "express-async-handler";
import Activity from "../models/Activity.js";
import { body, validationResult } from "express-validator";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";
import ClassModel from "../models/Class.js";
import Subject from "../models/Subject.js";
import Student from "../models/Student.js";
import mongoose from "mongoose";

// @desc    Create new exam
// @route   POST /api/exams
// @access  Private/Teacher, Admin
const createExam = [
  protect,
  authorize("TEACHER", "SUPER_ADMIN", "SCHOOL_ADMIN"),

  // Validation
  body("title").notEmpty().withMessage("Title is required"),
  body("type")
    .isIn(["MIDTERM", "FINAL", "QUIZ", "ASSIGNMENT", "PRACTICAL"])
    .withMessage("Invalid Exam Type"),
  body("class")
    .notEmpty()
    .withMessage("Class is required")
    .isMongoId()
    .withMessage("Invalid Class Id"),
  body("subject")
    .notEmpty()
    .withMessage("Subject is required")
    .isMongoId()
    .withMessage("Invalid Subject Id"),
  body("date").isISO8601().withMessage("Invalid date").toDate(),
  body("duration").isNumeric().withMessage("Duration must be a number"),
  body("totalMarks").isNumeric().withMessage("Total marks must be a number"),
  body("passingMarks")
    .isNumeric()
    .withMessage("Passing marks must be a number"),
  body("status")
    .optional()
    .isIn([
      "UPCOMING",
      "SCHEDULED",
      "ONGOING",
      "COMPLETED",
      "CANCELLED",
      "POSTPONED",
    ])
    .withMessage("Invalid Status"),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, "Validation failed", 400, errors.array());
    }

    const {
      title,
      type,
      class: classId,
      subject: subjectId,
      date,
      duration,
      totalMarks,
      passingMarks,
      status,
    } = req.body;

    const classExist = await ClassModel.findById(classId);
    if (!classExist) {
      return errorResponse(res, "Class not found", 404);
    }
    const subjectExist = await Subject.findById(subjectId);
    if (!subjectExist) {
      return errorResponse(res, "Subject not found", 404);
    }

    // Check if teacher has permission to create exam for this class and subject.
    if (req.user.role === "TEACHER") {
      const teacher = await Teacher.findOne({ user: req.user._id });
      if (!teacher) {
        return errorResponse(res, "Teacher not found", 404);
      }
      // Check if the teacher is assigned to the class.
      const isClassAssigned = teacher.assignedClasses.some(
        (assignedClass) => assignedClass.toString() === classId
      );
      const isSubjectAssigned = teacher.assignedSubjects.some(
        (assignedSubject) => assignedSubject.toString() === subjectId
      );
      if (!isClassAssigned || !isSubjectAssigned) {
        return errorResponse(
          res,
          "You are not authorized to create an exam for this class or subject",
          403
        );
      }
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const exam = await Exam.create(
        [
          {
            title,
            type,
            class: classId,
            subject: subjectId,
            date,
            duration,
            totalMarks,
            passingMarks,
            status: status || "UPCOMING",
            createdBy: req.user._id, // Set the creator
          },
        ],
        { session }
      );

      // Create result documents for each student in the class
      const students = await Student.find({ class: classId });

      const resultPromises = students.map((student) =>
        Result.create(
          [
            {
              student: student._id,
              exam: exam[0]._id,
              marksObtained: 0, // Initial marks
            },
          ],
          { session }
        )
      );

      const createdResults = await Promise.all(resultPromises);

      // Add the created result IDs to the exam's results array
      const resultIds = createdResults.map((result) => result[0]._id);
      await Exam.findByIdAndUpdate(
        exam[0]._id,
        { $push: { results: { $each: resultIds } } },
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      // Log activity
      await Activity.logActivity({
        userId: req.user._id,
        type: "EXAM_CREATED",
        description: `Created exam: ${exam[0].title}`,
        context: "exam-management", // Added context
        metadata: { examId: exam[0]._id },
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      });
      return successResponse(res, exam[0], "Exam created successfully", 201);
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error(error); // Log error
      return errorResponse(res, "Failed to create exam", 500, error.message);
    }
  }),
];

// @desc    Add exam result  (Deprecated - Results are now created with the exam)
// @route   POST /api/exams/:id/results
// @access  Private/Teacher

// @desc    Update exam status
// @route   PUT /api/exams/:id/status
// @access  Private/Teacher, Admin
const updateExamStatus = [
  protect,
  authorize("TEACHER", "SUPER_ADMIN", "SCHOOL_ADMIN"),

  // Validate status
  body("status")
    .isIn([
      "UPCOMING",
      "SCHEDULED",
      "ONGOING",
      "COMPLETED",
      "CANCELLED",
      "POSTPONED",
    ])
    .withMessage("Invalid Status"),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, "Validation failed", 400, errors.array());
    }

    const { status } = req.body;
    const exam = await Exam.findById(req.params.id);

    if (!exam) {
      return errorResponse(res, "Exam not found", 404);
    }

    // Check authorization for teachers
    if (req.user.role === "TEACHER") {
      if (exam.createdBy.toString() !== req.user._id.toString()) {
        return errorResponse(res, "Not authorized to update this exam", 403);
      }
    }

    exam.status = status;
    const updatedExam = await exam.save();
    // Log activity
    await Activity.logActivity({
      userId: req.user._id,
      type: "EXAM_STATUS_UPDATED",
      description: `Updated exam status to ${status} for exam ${exam.title}`,
      context: "exam-management", // Added context
      metadata: { examId: exam._id },
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });
    return successResponse(
      res,
      updatedExam,
      "Exam status updated successfully"
    );
  }),
];

// @desc    Get all exams
// @route   GET /api/exams
// @access  Private (Admin, Teacher)
const getExams = [
  protect,
  authorize("SUPER_ADMIN", "SCHOOL_ADMIN", "TEACHER"),
  asyncHandler(async (req, res) => {
    let query = {};

    // If the user is a teacher, only return exams they created or that are for their assigned classes/subjects
    if (req.user.role === "TEACHER") {
      query = {
        $or: [
          { createdBy: req.user._id }, // Exams the teacher created
          { class: { $in: req.user.assignedClasses } }, // Exams for classes the teacher is assigned to
        ],
      };
    }

    const exams = await Exam.find(query)
      .populate("class", "name section")
      .populate("subject", "name code")
      .populate("createdBy", "firstName lastName");
    return successResponse(res, exams, "Exams retrieved successfully");
  }),
];

// @desc    Get exam by ID
// @route   GET /api/exams/:id
// @access  Private (Admin, Teacher, Student)
const getExamById = [
  protect,
  authorize("SUPER_ADMIN", "SCHOOL_ADMIN", "TEACHER", "STUDENT"),
  asyncHandler(async (req, res) => {
    const exam = await Exam.findById(req.params.id)
      .populate("class", "name section")
      .populate("subject", "name code")
      .populate("createdBy", "firstName lastName");

    if (!exam) {
      return errorResponse(res, "Exam not found", 404);
    }
    // If the user is a teacher, only allow access if they created the exam or it's for their assigned classes
    if (req.user.role === "TEACHER") {
      const teacher = await Teacher.findOne({ user: req.user._id });
      if (
        exam.createdBy.toString() !== req.user._id.toString() &&
        !teacher.assignedClasses.includes(exam.class._id.toString())
      ) {
        return errorResponse(res, "Not authorized to access this exam", 403);
      }
    }
    // If user is student, they can only access the exam if they are a student of the class
    if (req.user.role === "STUDENT") {
      const student = await Student.findOne({ user: req.user._id });
      if (!student.class.equals(exam.class._id)) {
        return errorResponse(res, "Not authorized to access this exam", 403);
      }
    }
    return successResponse(res, exam, "Exam retrieved successfully");
  }),
];

// @desc    Update exam details
// @route   PUT /api/exams/:id
// @access  Private/Teacher, Admin
const updateExam = [
  protect,
  authorize("TEACHER", "SUPER_ADMIN", "SCHOOL_ADMIN"),

  // Validation (optional updates)
  body("title").optional().notEmpty().withMessage("Title is required"),
  body("type")
    .optional()
    .isIn(["MIDTERM", "FINAL", "QUIZ", "ASSIGNMENT", "PRACTICAL"])
    .withMessage("Invalid Exam Type"),
  body("class")
    .optional()
    .notEmpty()
    .withMessage("Class is required")
    .isMongoId()
    .withMessage("Invalid Class Id"),
  body("subject")
    .optional()
    .notEmpty()
    .withMessage("Subject is required")
    .isMongoId()
    .withMessage("Invalid Subject Id"),
  body("date").optional().isISO8601().withMessage("Invalid date").toDate(),
  body("duration")
    .optional()
    .isNumeric()
    .withMessage("Duration must be a number"),
  body("totalMarks")
    .optional()
    .isNumeric()
    .withMessage("Total marks must be a number"),
  body("passingMarks")
    .optional()
    .isNumeric()
    .withMessage("Passing marks must be a number"),
  body("status")
    .optional()
    .isIn([
      "UPCOMING",
      "SCHEDULED",
      "ONGOING",
      "COMPLETED",
      "CANCELLED",
      "POSTPONED",
    ])
    .withMessage("Invalid Status"),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, "Validation failed", 400, errors.array());
    }
    const exam = await Exam.findById(req.params.id);

    if (!exam) {
      return errorResponse(res, "Exam not found", 404);
    }
    const {
      title,
      type,
      class: classId,
      subject: subjectId,
      date,
      duration,
      totalMarks,
      passingMarks,
      status,
    } = req.body;
    // Check authorization for teachers
    if (req.user.role === "TEACHER") {
      if (exam.createdBy.toString() !== req.user._id.toString()) {
        return errorResponse(res, "Not authorized to update this exam", 403);
      }
    }
    //Check class and subject exist
    if (classId) {
      const classExist = await ClassModel.findById(classId);
      if (!classExist) {
        return errorResponse(res, "Class not found", 404);
      }
    }
    if (subjectId) {
      const subjectExist = await Subject.findById(subjectId);
      if (!subjectExist) {
        return errorResponse(res, "Subject not found", 404);
      }
    }

    // Prepare the update object
    const updateData = {
      title: title || exam.title,
      type: type || exam.type,
      class: classId || exam.class,
      subject: subjectId || exam.subject,
      date: date || exam.date,
      duration: duration || exam.duration,
      totalMarks: totalMarks || exam.totalMarks,
      passingMarks: passingMarks || exam.passingMarks,
      status: status || exam.status,
    };

    const updatedExam = await Exam.findOneAndUpdate(
      { _id: req.params.id },
      updateData,
      { new: true, runValidators: true } // Return the updated document
    );

    // Log activity
    await Activity.logActivity({
      userId: req.user._id,
      type: "EXAM_UPDATED",
      description: `Updated exam details for ${updatedExam.title}`,
      context: "exam-management", // Added context
      metadata: { examId: updatedExam._id },
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });
    return successResponse(res, updatedExam, "Exam updated successfully");
  }),
];

// @desc    Delete exam
// @route   DELETE /api/exams/:id
// @access  Private/Admin
const deleteExam = [
  protect,
  authorize("SUPER_ADMIN", "SCHOOL_ADMIN"),
  asyncHandler(async (req, res) => {
    const exam = await Exam.findById(req.params.id);

    if (!exam) {
      return errorResponse(res, "Exam not found", 404);
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Delete associated results
      await Result.deleteMany({ exam: exam._id }, { session });

      // Delete the exam itself
      await Exam.deleteOne({ _id: exam._id }, { session });

      await session.commitTransaction();
      session.endSession();

      // Log activity
      await Activity.logActivity({
        userId: req.user._id,
        type: "EXAM_DELETED",
        description: `Deleted exam ${exam.title}`,
        context: "exam-management", // Added context
        metadata: { examId: exam._id },
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      });
      return successResponse(res, null, "Exam removed");
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error(error);
      return errorResponse(res, "Failed to delete exam", 500);
    }
  }),
];

// @desc    Get exam results for a specific exam
// @route   GET /api/exams/:id/results
// @access  Private (Admin, Teacher, Student)
const getExamResults = [
  protect,
  asyncHandler(async (req, res) => {
    const exam = await Exam.findById(req.params.id)
      .populate({
        path: "results",
        populate: {
          path: "student",
          select: "user admissionNumber rollNumber",
          populate: { path: "user", select: "firstName lastName" },
        },
      })
      .populate("class", "name section")
      .populate("subject", "name code")
      .select("results title date class subject");

    if (!exam) {
      return errorResponse(res, "Exam not found", 404);
    }

    // Authorization checks
    if (req.user.role === "TEACHER") {
      const teacher = await Teacher.findOne({ user: req.user._id });
      if (!teacher) {
        return errorResponse(res, "Teacher not found", 404);
      }
      if (
        exam.createdBy.toString() !== req.user._id.toString() &&
        !teacher.assignedClasses.includes(exam.class._id.toString())
      ) {
        return errorResponse(
          res,
          "Not authorized to access these results",
          403
        );
      }
    } else if (req.user.role === "STUDENT") {
      const student = await Student.findOne({ user: req.user._id });
      if (!student || !student.class.equals(exam.class._id)) {
        return errorResponse(
          res,
          "Not authorized to access these results",
          403
        );
      }
    }

    // Format the results for better frontend consumption
    const formattedResults = exam.results.map((result) => ({
      student: {
        id: result.student._id,
        admissionNumber: result.student.admissionNumber,
        rollNumber: result.student.rollNumber,
        name:
          result.student.user.firstName + " " + result.student.user.lastName, // Combine for full name
      },
      marksObtained: result.marksObtained,
      grade: result.grade,
      remarks: result.remarks,
    }));
    return successResponse(
      res,
      {
        exam: exam.title,
        date: exam.date,
        class: exam.class,
        subject: exam.subject,
        results: formattedResults, // Use the formatted results
      },
      "Exam results retrieved successfully"
    );
  }),
];

// @desc    Update exam result for a specific student
// @route   PUT /api/exams/:id/results/:resultId
// @access  Private/Teacher
const updateExamResult = [
  protect,
  authorize("TEACHER"),

  // Validate marksObtained
  body("marksObtained")
    .isNumeric()
    .withMessage("Marks obtained must be a number"),
  body("grade").optional(),
  body("remarks").optional(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, "Validation failed", 400, errors.array());
    }

    const { marksObtained, grade, remarks } = req.body;
    const examId = req.params.id;
    const resultId = req.params.resultId;

    const exam = await Exam.findById(examId);
    if (!exam) {
      return errorResponse(res, "Exam not found", 404);
    }

    // Check teacher's authorization (if they created the exam or teach the subject/class)
    const teacher = await Teacher.findOne({ user: req.user._id });
    if (!teacher) {
      return errorResponse(res, "Teacher not found", 404);
    }
    if (
      exam.createdBy.toString() !== req.user._id.toString() &&
      !teacher.assignedClasses.includes(exam.class.toString())
    ) {
      return errorResponse(res, "Not authorized to update this result", 403);
    }

    const result = await Result.findById(resultId);
    if (!result) {
      return errorResponse(res, "Result not found", 404);
    }

    // Make sure the result belongs to the exam
    if (!exam.results.some((r) => r.toString() === resultId)) {
      return errorResponse(
        res,
        "Result does not belong to the specified exam",
        400
      );
    }

    // Update the result
    const updatedResult = await Result.findOneAndUpdate(
      { _id: resultId },
      { marksObtained, grade, remarks },
      { new: true, runValidators: true }
    );

    // Log activity
    await Activity.logActivity({
      userId: req.user._id,
      type: "EXAM_RESULT_UPDATED",
      description: `Updated result for student ${result.student} in exam ${exam.title}`,
      context: "exam-management",
      metadata: { examId: exam._id, resultId: result._id },
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });

    return successResponse(
      res,
      updatedResult,
      "Exam result updated successfully"
    );
  }),
];

export {
  createExam,
  updateExamStatus,
  getExamResults,
  getExams,
  getExamById,
  updateExam,
  deleteExam,
  updateExamResult,
};
