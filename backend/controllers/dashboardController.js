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
import Parent from "../models/Parent.js";
import School from "../models/School.js";

// @desc    Get dashboard statistics based on user role
// @route   GET /api/dashboard
// @access  Private
const getDashboardStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const userRole = req.user.role;

  if (
    !["SUPER_ADMIN", "SCHOOL_ADMIN", "TEACHER", "STUDENT", "PARENT"].includes(
      userRole
    )
  ) {
    return res.status(403).json({ message: "Unauthorized role" });
  }

  // Base stats for all roles
  const baseStats = {
    activities: await Activity.find({ user: userId })
      .sort("-createdAt")
      .limit(5)
      .lean(),
    upcomingEvents: await Calendar.find({
      start: { $gte: new Date() },
      $or: [
        { visibility: "PUBLIC" },
        { participants: userId },
        { createdBy: userId },
      ],
    })
      .sort("start")
      .limit(5)
      .lean(),
  };

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
      throw new Error("Invalid role");
  }

  res.status(200).json({ ...baseStats, ...roleStats });
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
            $gte: new Date(new Date().setHours(0, 0, 0, 0)),
            $lte: new Date(new Date().setHours(23, 59, 59, 999)),
          },
        },
      },
      { $group: { _id: "$status", count: { $sum: 1 } } },
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
    Exam.find({ status: { $in: ["SCHEDULED", "UPCOMING"] } })
      .sort("date")
      .limit(5)
      .populate("class subject")
      .lean(),
  ]);

  console.log("Admin Stats Data:");
  console.log("  Total Students:", totalStudents);
  console.log("  Total Teachers:", totalTeachers);
  console.log("  Total Classes:", totalClasses);
  console.log("  Active Users:", activeUsers);
  console.log("  Today Attendance:", todayAttendance);
  console.log("  Fee Summary:", feeSummary);
  console.log("  Recent Exams:", recentExams);


  return {
    overview: {
      totalStudents,
      totalTeachers,
      totalClasses,
      activeUsers,
      todayAttendance: todayAttendance.reduce(
        (acc, curr) => ({ ...acc, [curr._id]: curr.count }),
        {}
      ),
      feeSummary: feeSummary[0] || { totalAmount: 0, totalPaid: 0, pending: 0 },
    },
    recentExams,
  };
};

// Teacher-specific statistics
const getTeacherStats = async (userId) => {
  const teacher = await Teacher.findOne({ user: userId })
    .populate("assignedClasses assignedSubjects")
    .lean();
  if (!teacher) throw new Error("Teacher not found");

  const [classes, upcomingExams, totalStudents] = await Promise.all([
    ClassModel.find({
      $or: [
        { classTeacher: teacher._id },
        { subjects: { $in: teacher.assignedSubjects.map((s) => s._id) } },
      ],
    }).lean(),
    Exam.find({
      createdBy: userId,
      status: { $in: ["SCHEDULED", "UPCOMING"] },
      date: { $gte: new Date() },
    })
      .sort("date")
      .limit(5)
      .lean(),
    Student.countDocuments({
      class: { $in: teacher.assignedClasses.map((c) => c._id) },
    }),
  ]);

  const schedule = await ClassModel.aggregate([
    {
      $match: {
        $or: [
          { classTeacher: teacher._id },
          { subjects: { $in: teacher.assignedSubjects.map((s) => s._id) } },
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
    { $sort: { _id: 1 } },
  ]);

  return {
    teacherOverview: {
      totalClasses: classes.length,
      totalSubjects: teacher.assignedSubjects.length,
      totalStudents,
    },
    schedule,
    upcomingExams,
  };
};

// Student-specific statistics
const getStudentStats = async (userId) => {
  const student = await Student.findOne({ user: userId })
    .populate("class", "name section")
    .lean();
  if (!student) throw new Error("Student not found");

  const [attendanceSummary, upcomingExams, feeStatus] = await Promise.all([
    Attendance.aggregate([
      { $match: { student: student._id } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
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
      attendanceSummary: attendanceSummary.reduce(
        (acc, curr) => ({ ...acc, [curr._id]: curr.count }),
        {}
      ),
      feeStatus: feeStatus.reduce(
        (acc, curr) => ({
          ...acc,
          [curr._id]: { total: curr.total, paid: curr.paid },
        }),
        {}
      ),
    },
    upcomingExams,
  };
};

// Parent-specific statistics
const getParentStats = async (userId) => {
  const parent = await Parent.findOne({ user: userId }).lean();
  if (!parent) throw new Error("Parent not found");

  const students = await Student.find({ "parentInfo.guardian": parent._id })
    .select("admissionNumber class status")
    .lean();
  const studentIds = students.map((s) => s._id);

  const [attendanceSummary, feeStatus] = await Promise.all([
    Attendance.aggregate([
      { $match: { student: { $in: studentIds } } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
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
      attendanceSummary: attendanceSummary.reduce(
        (acc, curr) => ({ ...acc, [curr._id]: curr.count }),
        {}
      ),
      feeStatus: feeStatus.reduce(
        (acc, curr) => ({
          ...acc,
          [curr._id]: { total: curr.total, paid: curr.paid },
        }),
        {}
      ),
      wards: students,
    },
  };
};

// @desc    Get school-specific dashboard statistics for Super Admin
// @route   GET /api/dashboard/school-stats
// @access  Private (Super Admin)
const getSchoolStats = asyncHandler(async (req, res) => {
  const totalSchools = await User.countDocuments({ role: "SCHOOL_ADMIN" }); // Proxy for total schools
  const totalStudents = await Student.countDocuments();
  const activeUsers = await User.countDocuments({ status: "ACTIVE" });
  const pendingApprovals = await User.countDocuments({ status: "PENDING" });

  res.status(200).json({
    totalSchools,
    totalStudents,
    activeUsers,
    pendingApprovals,
  });
});


// @desc    Get user role distribution
// @route   GET /api/dashboard/user-role-distribution
// @access  Private/SuperAdmin
const getUserRoleDistribution = asyncHandler(async (req, res) => {
  const roleDistribution = await User.aggregate([
    {
      $group: {
        _id: "$role",
        count: { $sum: 1 },
      },
    },
  ]);
  return res.status(200).json(roleDistribution);
});

// @desc    Get user status distribution
// @route   GET /api/dashboard/user-status-distribution
// @access  Private/SuperAdmin
const getUserStatusDistribution = asyncHandler(async (req, res) => {
  const statusDistribution = await User.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);
  return res.status(200).json(statusDistribution);
});

// @desc    Get school status distribution
// @route   GET /api/dashboard/school-status-distribution
// @access  Private/SuperAdmin
const getSchoolStatusDistribution = asyncHandler(async (req, res) => {
  const schoolStatusDistribution = await School.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);
  return res.status(200).json(schoolStatusDistribution);
});

// @desc    Get user registration trends
// @route   GET /api/dashboard/user-registration-trends
// @access  Private/SuperAdmin
const getUserRegistrationTrends = asyncHandler(async (req, res) => {
  // Example: Get registrations per month for the last 12 months
  const registrationTrends = await User.aggregate([
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1 },
    },
    {
        $limit: 12 // Limit to last 12 months
    }
  ]);
  return res.status(200).json(registrationTrends);
});


export { getDashboardStats, getSchoolStats, getUserRoleDistribution, getUserStatusDistribution, getSchoolStatusDistribution, getUserRegistrationTrends };
