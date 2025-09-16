// controllers/attendanceController.js
import Attendance from "../models/Attendance.js";
import asyncHandler from "express-async-handler";
import Activity from "../models/Activity.js";
import { body, validationResult } from "express-validator";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";
import ClassModel from "../models/Class.js";
import Student from "../models/Student.js";
import mongoose from "mongoose";
// @desc    Mark attendance (for multiple students at once)
// @route   POST /api/attendance
// @access  Private/Teacher
const markAttendance = [
  protect,
  authorize("TEACHER"),

  // Validation rules
  body("classId")
    .notEmpty()
    .withMessage("Class ID is required")
    .isMongoId()
    .withMessage("Invalid Class Id"),
  body("date").isISO8601().withMessage("Invalid date").toDate(),
  body("students").isArray().withMessage("Students must be an array"),
  body("students.*.studentId")
    .notEmpty()
    .withMessage("Student ID is required for each student")
    .isMongoId()
    .withMessage("Invalid Student Id"),
  body("students.*.status")
    .notEmpty()
    .withMessage("Status is required for each student")
    .isIn(["PRESENT", "ABSENT", "LATE", "EXCUSED", "SPORTS"]),
  body("students.*.timeIn")
    .optional()
    .isISO8601()
    .withMessage("Invalid timeIn format")
    .toDate(), // Validate timeIn/timeOut
  body("students.*.timeOut")
    .optional()
    .isISO8601()
    .withMessage("Invalid timeOut format")
    .toDate(),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, "Validation failed", 400, errors.array());
    }
    const { classId, date, students } = req.body;

    // Check if the class exists
    const classExists = await ClassModel.findById(classId);
    if (!classExists) {
      return errorResponse(res, "Class not found", 404);
    }

    // Check if the teacher is authorized to mark attendance for this class.
    const teacher = await Teacher.findOne({ user: req.user._id });
    if (!teacher) {
      return errorResponse(res, "Teacher Not Found", 404);
    }
    if (!teacher.assignedClasses.includes(classId)) {
      return errorResponse(
        res,
        "You are not authorized to mark attendance for this class",
        403
      );
    }

    // Start a session for transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const attendanceRecords = await Promise.all(
        students.map(async (student) => {
          // Check if the student exists
          const studentExists = await Student.findById(student.studentId);

          if (!studentExists) {
            throw new Error(`Student with ID ${student.studentId} not found`); // Throw error for transaction
          }
          // Create or update attendance record using findOneAndUpdate with upsert
          const attendanceRecord = await Attendance.findOneAndUpdate(
            {
              student: student.studentId,
              class: classId,
              date: new Date(date),
            },
            {
              student: student.studentId,
              class: classId,
              date: new Date(date),
              status: student.status,
              timeIn: student.timeIn,
              timeOut: student.timeOut,
            },
            {
              upsert: true, // Create if not exists, update if exists
              new: true, // Return the updated document
              runValidators: true, // Run schema validators
              session, // Associate with the session
            }
          );

          // Log activity for each student
          await Activity.logActivity({
            userId: req.user._id,
            type: "ATTENDANCE_MARKED",
            description: `Marked ${student.status} for student ${student.studentId} in class ${classId} on ${date}`,
            context: "attendance-management", // Added context
            metadata: {
              studentId: student.studentId,
              classId,
              date,
              status: student.status,
            },
            ip: req.ip,
            userAgent: req.headers["user-agent"],
          });

          return attendanceRecord;
        })
      );

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();
      return successResponse(
        res,
        attendanceRecords,
        "Attendance marked successfully",
        201
      );
    } catch (error) {
      // Abort transaction on error
      await session.abortTransaction();
      session.endSession();
      console.error(error);
      return errorResponse(
        res,
        "Failed to mark attendance",
        500,
        error.message
      );
    }
  }),
];

// @desc    Get attendance report
// @route   GET /api/attendance/report
// @access  Private (Admin, Teacher)
const getAttendanceReport = [
  protect,
  authorize("SUPER_ADMIN", "SCHOOL_ADMIN", "TEACHER"),
  asyncHandler(async (req, res) => {
    const { startDate, endDate, classId, studentId, status } = req.query;

    const match = {};

    if (startDate && endDate) {
      match.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }
    if (classId) {
      match.class = new mongoose.Types.ObjectId(classId); // Ensure correct type for aggregation
    }
    if (studentId) {
      match.student = new mongoose.Types.ObjectId(studentId); // Ensure correct type for aggregation
    }
    if (status) {
      match.status = status;
    }

    // If teacher, limit to their assigned classes
    if (req.user.role === "TEACHER") {
      const teacher = await Teacher.findOne({ user: req.user._id });
      if (!teacher) {
        return errorResponse(res, "Teacher not found", 404);
      }
      if (Object.keys(match).length === 0) {
        match.class = { $in: teacher.assignedClasses };
      } else if (match.class) {
        if (!teacher.assignedClasses.includes(match.class.toString())) {
          return errorResponse(
            res,
            "Not authorized to view attendance for this class",
            403
          );
        }
      }
    }

    const report = await Attendance.aggregate([
      { $match: match },
      {
        $group: {
          _id: { date: "$date", status: "$status" }, // Group by date and status
          count: { $sum: 1 },
          students: { $addToSet: "$student" }, // Collect unique students
        },
      },
      {
        $project: {
          date: "$_id.date",
          status: "$_id.status",
          count: 1,
          uniqueStudents: { $size: "$students" }, // Count of unique students
          _id: 0,
        },
      },
      {
        $sort: { date: -1 }, // Sort by date, newest first
      },
    ]);
    return successResponse(
      res,
      report,
      "Attendance report generated successfully"
    );
  }),
];

// @desc    Bulk update attendance (for a specific date and class)
// @route   PUT /api/attendance/bulk
// @access  Private/Teacher
const bulkUpdateAttendance = [
  protect,
  authorize("TEACHER"),

  // Validation
  body("date").isISO8601().withMessage("Invalid date").toDate(),
  body("classId")
    .notEmpty()
    .withMessage("Class ID is required")
    .isMongoId()
    .withMessage("Invalid Class Id"),
  body("attendanceData")
    .isArray()
    .withMessage("attendanceData must be an array"),
  body("attendanceData.*.studentId")
    .notEmpty()
    .withMessage("Student ID is required for each record")
    .isMongoId()
    .withMessage("Invalid Student Id"),
  body("attendanceData.*.status")
    .notEmpty()
    .withMessage("Status is required for each record")
    .isIn(["PRESENT", "ABSENT", "LATE", "EXCUSED", "SPORTS"]),
  body("attendanceData.*.timeIn")
    .optional()
    .isISO8601()
    .withMessage("Invalid timeIn format")
    .toDate(),
  body("attendanceData.*.timeOut")
    .optional()
    .isISO8601()
    .withMessage("Invalid timeOut format")
    .toDate(),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, "Validation failed", 400, errors.array());
    }

    const { date, classId, attendanceData } = req.body;
    // Check if the class exists
    const classExists = await ClassModel.findById(classId);
    if (!classExists) {
      return errorResponse(res, "Class not found", 404);
    }

    // Check if the teacher is authorized to mark attendance for this class.
    const teacher = await Teacher.findOne({ user: req.user._id });
    if (!teacher) {
      return errorResponse(res, "Teacher not found", 404);
    }
    if (!teacher.assignedClasses.includes(classId)) {
      return errorResponse(
        res,
        "You are not authorized to update attendance for this class",
        403
      );
    }

    // Start a session for transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const bulkOps = attendanceData.map((record) => ({
        updateOne: {
          filter: {
            student: record.studentId,
            class: classId,
            date: new Date(date),
          },
          update: {
            $set: {
              status: record.status,
              timeIn: record.timeIn, // Update timeIn
              timeOut: record.timeOut, // Update timeOut
            },
          },
          upsert: true, // Important: Create if not exists
        },
      }));

      await Attendance.bulkWrite(bulkOps, { session }); // Pass session

      // Commit transaction
      await session.commitTransaction();
      session.endSession();

      // Log activity
      await Activity.logActivity({
        userId: req.user._id,
        type: "ATTENDANCE_UPDATED", // Use a more appropriate type
        description: `Bulk updated attendance for ${attendanceData.length} students in class ${classId} on ${date}`,
        context: "attendance-management", // Added context
        metadata: { classId, date, numRecords: attendanceData.length },
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      });
      return successResponse(res, null, "Attendance updated successfully");
    } catch (error) {
      // Abort transaction on error
      await session.abortTransaction();
      session.endSession();
      console.error(error);
      return errorResponse(
        res,
        "Failed to update attendance",
        500,
        error.message
      );
    }
  }),
];

// @desc Get attendance by ID
// @route GET /api/attendance/:id
// @access Private (Admin, Teacher)
const getAttendanceById = [
  protect,
  authorize("SUPER_ADMIN", "SCHOOL_ADMIN", "TEACHER"),
  asyncHandler(async (req, res) => {
    const attendanceId = req.params.id;

    const attendanceRecord = await Attendance.findById(attendanceId)
      .populate("student", "admissionNumber user") // Populate student details
      .populate({ path: "student.user", select: "firstName lastName" })
      .populate("class", "name section"); // Populate class details

    if (!attendanceRecord) {
      return errorResponse(res, "Attendance record not found", 404);
    }

    // Check authorization for teachers.
    if (req.user.role === "TEACHER") {
      const teacher = await Teacher.findOne({ user: req.user._id });
      if (
        !teacher ||
        !teacher.assignedClasses.includes(attendanceRecord.class._id.toString())
      ) {
        return errorResponse(
          res,
          "Not authorized to view this attendance record",
          403
        );
      }
    }
    return successResponse(
      res,
      attendanceRecord,
      "Attendance record retrieved successfully"
    );
  }),
];

// @desc    Get attendance records
// @route   GET /api/attendance
// @access  Private/Admin, Teacher
const getAttendance = [
  protect,
  authorize("SUPER_ADMIN", "SCHOOL_ADMIN", "TEACHER"),
  asyncHandler(async (req, res) => {
    const { classId, date, status, studentId } = req.query;
    
    let query = {};
    
    if (classId) query.class = classId;
    if (studentId) query.student = studentId;
    if (status) query.status = status;
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      query.date = { $gte: startDate, $lte: endDate };
    }

    const attendance = await Attendance.find(query)
      .populate("student", "admissionNumber rollNumber")
      .populate("class", "name section")
      .sort({ date: -1, createdAt: -1 })
      .lean();

    return successResponse(res, attendance, "Attendance records retrieved successfully");
  }),
];

export {
  markAttendance,
  getAttendance,
  getAttendanceReport,
  bulkUpdateAttendance,
  getAttendanceById,
};
