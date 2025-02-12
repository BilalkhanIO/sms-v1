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

// @desc    Get dashboard statistics
// @route   GET /api/dashboard
// @access  Private
const getDashboardStats = asyncHandler(async (req, res) => {
  const userId = req.user.id;
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

  res.json({ ...baseStats, ...roleStats });
});

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
            $gte: new Date().setHours(0, 0, 0, 0),
            $lte: new Date().setHours(23, 59, 59, 999),
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
    Exam.find({ status: "SCHEDULED" })
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
      feeSummary: feeSummary[0] || {},
    },
    recentExams,
  };
};

// Teacher-specific statistics
const getTeacherStats = async (userId) => {
  const teacher = await Teacher.findOne({ user: userId }).populate(
    "assignedClasses assignedSubjects"
  );

  const [classes, schedule, upcomingExams, students] = await Promise.all([
    ClassModel.find({ classTeacher: teacher._id }),
    ClassModel.aggregate([
      { $unwind: "$schedule" },
      { $unwind: "$schedule.periods" },
      { $match: { "schedule.periods.teacher": teacher._id } },
      {
        $group: {
          _id: "$schedule.day",
          periods: { $push: "$schedule.periods" },
        },
      },
    ]),
    Exam.find({
      createdBy: userId,
      status: "SCHEDULED",
      date: { $gte: new Date() },
    })
      .sort("date")
      .limit(5)
      .lean(),
    Student.countDocuments({
      class: { $in: teacher.assignedClasses },
    }),
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

  const [attendanceSummary, upcomingExams, feeStatus] = await Promise.all([
    Attendance.aggregate([
      { $match: { student: student._id } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          lastDate: { $max: "$date" },
        },
      },
    ]),
    Exam.find({
      class: student.class,
      status: "SCHEDULED",
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
      upcomingExams,
    },
  };
};

// Parent-specific statistics (assuming parent-student relationship)
const getParentStats = async (userId) => {
  const students = await Student.find({
    "parentInfo.guardian": userId,
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
