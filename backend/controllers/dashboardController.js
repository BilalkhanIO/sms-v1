// controllers/dashboardController.js
import asyncHandler from "express-async-handler";
import Activity from "../models/Activity.js";
import ClassModel from "../models/Class.js";
import Student from "../models/Student.js";
import Attendance from "../models/Attendance.js";
import Fee from "../models/Fee.js";
import Exam from "../models/Exam.js";
import Calendar from "../models/Calendar.js";
import Teacher from "../models/Teacher.js";
import User from "../models/User.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

// @desc    Get dashboard statistics
// @route   GET /api/dashboard
// @access  Private
const getDashboardStats = [
  protect, // Protect the route
  asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const userRole = req.user.role;
    const currentDate = new Date();

    // Common statistics for all roles
    const baseStats = {
      activities: await Activity.find({ user: userId })
        .sort("-createdAt")
        .limit(5)
        .lean(),
      upcomingEvents: await Calendar.find({
        start: { $gte: currentDate },
        $or: [
          { visibility: "public" },
          { participants: userId },
          { createdBy: userId },
        ],
      })
        .sort("start")
        .limit(5)
        .lean(),
    };

    // Role-specific statistics
    let roleStats = {};

    switch (userRole) {
      case "SUPER_ADMIN":
      case "SCHOOL_ADMIN":
        roleStats = await getAdminStats();
        break;
      case "TEACHER":
        roleStats = await getTeacherStats(userId);
        break;
      case "STUDENT":
        roleStats = await getStudentStats(userId);
        break;
      case "PARENT":
        roleStats = await getParentStats(userId);
        break;
      default:
        roleStats = {};
    }

    return successResponse(
      res,
      { ...baseStats, ...roleStats },
      "Dashboard statistics retrieved successfully"
    );
  }),
];

// Admin-specific statistics
const getAdminStats = async () => {
  const [
    totalStudents,
    totalTeachers,
    totalClasses,
    activeUsers,
    todayAttendance,
    feeSummary,
    recentExams,
  ] = await Promise.all([
    Student.countDocuments(),
    Teacher.countDocuments(),
    ClassModel.countDocuments(),
    User.countDocuments({ status: "ACTIVE" }),
    Attendance.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(new Date().setHours(0, 0, 0, 0)), // Start of today
            $lte: new Date(new Date().setHours(23, 59, 59, 999)), // End of today
          },
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]),
    Fee.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
          totalPaid: { $sum: "$paidAmount" },
          pending: { $sum: { $subtract: ["$amount", "$paidAmount"] } },
        },
      },
    ]),
    Exam.find({ status: { $in: ["SCHEDULED", "UPCOMING"] } }) // Include both SCHEDULED and UPCOMING exams
      .sort("date")
      .limit(5)
      .populate("class subject")
      .lean(),
  ]);

  return {
    overview: {
      totalStudents,
      totalTeachers,
      totalClasses,
      activeUsers,
      todayAttendance: todayAttendance.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {}),
      feeSummary: feeSummary[0] || {}, // Handle potential empty result
    },
    recentExams,
  };
};

// Teacher-specific statistics
const getTeacherStats = async (userId) => {
  const teacher = await Teacher.findOne({ user: userId }).populate(
    "assignedClasses assignedSubjects"
  );
  if (!teacher) {
    return {};
  }
  const [classes, upcomingExams, students] = await Promise.all([
    ClassModel.find({
      $or: [
        { classTeacher: teacher._id }, // Classes where the teacher is class teacher.
        { subjects: { $in: teacher.assignedSubjects } }, // Classes where teacher teach subject.
      ],
    }),
    Exam.find({
      createdBy: userId,
      status: { $in: ["SCHEDULED", "UPCOMING"] },
      date: { $gte: new Date() },
    })
      .sort("date")
      .limit(5)
      .lean(),
    Student.countDocuments({
      class: { $in: teacher.assignedClasses },
    }),
  ]);

  // Aggregate schedule directly using teacher's assigned classes and subjects
  const schedule = await ClassModel.aggregate([
    {
      $match: {
        $or: [
          { classTeacher: teacher._id },
          { subjects: { $in: teacher.assignedSubjects } },
        ],
      },
    },
    { $unwind: "$schedule" },
    { $unwind: "$schedule.periods" },
    { $match: { "schedule.periods.teacher": teacher._id } },
    {
      $group: {
        _id: "$schedule.day",
        periods: { $push: "$schedule.periods" },
      },
    },
    { $sort: { _id: 1 } }, //sort by day
  ]);

  return {
    teacherOverview: {
      totalClasses: classes.length,
      totalSubjects: teacher.assignedSubjects.length,
      totalStudents: students,
    },
    schedule,
    upcomingExams,
  };
};

// Student-specific statistics
const getStudentStats = async (userId) => {
  const student = await Student.findOne({ user: userId }).populate(
    "class",
    "name section"
  );
  if (!student) {
    return {};
  }

  const [attendanceSummary, upcomingExams, feeStatus] = await Promise.all([
    Attendance.aggregate([
      { $match: { student: student._id } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]),
    Exam.find({
      class: student.class,
      status: { $in: ["SCHEDULED", "UPCOMING"] },
      date: { $gte: new Date() },
    })
      .sort("date")
      .limit(5)
      .lean(),
    Fee.aggregate([
      { $match: { student: student._id } },
      {
        $group: {
          _id: "$status",
          total: { $sum: "$amount" },
          paid: { $sum: "$paidAmount" },
        },
      },
    ]),
  ]);

  return {
    studentOverview: {
      class: student.class,
      attendanceSummary: attendanceSummary.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {}),
      feeStatus: feeStatus.reduce((acc, curr) => {
        acc[curr._id] = { total: curr.total, paid: curr.paid };
        return acc;
      }, {}),
    },
    upcomingExams,
  };
};

// Parent-specific statistics
const getParentStats = async (userId) => {
  const parent = await Parent.findOne({ user: userId });
  if (!parent) {
    return {};
  }
  const students = await Student.find({
    "parentInfo.guardian": parent._id,
  }).select("admissionNumber class status");

  const studentIds = students.map((s) => s._id);

  const [attendanceSummary, feeStatus] = await Promise.all([
    Attendance.aggregate([
      { $match: { student: { $in: studentIds } } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]),
    Fee.aggregate([
      { $match: { student: { $in: studentIds } } },
      {
        $group: {
          _id: "$status",
          total: { $sum: "$amount" },
          paid: { $sum: "$paidAmount" },
        },
      },
    ]),
  ]);

  return {
    parentOverview: {
      totalWards: students.length,
      attendanceSummary: attendanceSummary.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {}),
      feeStatus: feeStatus.reduce((acc, curr) => {
        acc[curr._id] = { total: curr.total, paid: curr.paid };
        return acc;
      }, {}),
      wards: students,
    },
  };
};

export { getDashboardStats };
