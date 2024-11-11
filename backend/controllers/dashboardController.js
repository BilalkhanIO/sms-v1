const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Class = require('../models/Class');
const Attendance = require('../models/Attendance');
const Activity = require('../models/Activity');

// @desc    Get dashboard stats based on role
// @route   GET /api/dashboard/stats/:role
// @access  Private
exports.getStats = asyncHandler(async (req, res, next) => {
  const { role } = req.params;
  let stats;

  switch (role) {
    case 'admin':
      stats = await getAdminStats();
      break;
    case 'teacher':
      stats = await getTeacherStats(req.user.id);
      break;
    case 'student':
      stats = await getStudentStats(req.user.id);
      break;
    default:
      return next(new ErrorResponse('Invalid role specified', 400));
  }

  res.status(200).json({
    success: true,
    role,
    data: stats
  });
});

// @desc    Get recent activities
// @route   GET /api/dashboard/activities
// @access  Private
exports.getRecentActivities = asyncHandler(async (req, res, next) => {
  const activities = await Activity.find()
    .sort('-createdAt')
    .limit(10)
    .populate('user', 'name role');

  res.status(200).json({
    success: true,
    data: activities
  });
});

// @desc    Get upcoming classes
// @route   GET /api/dashboard/upcoming-classes
// @access  Private
exports.getUpcomingClasses = asyncHandler(async (req, res, next) => {
  const classes = await Class.find({
    date: { $gte: new Date() }
  })
    .sort('date')
    .limit(5)
    .populate('teacher', 'name')
    .populate('subject', 'name');

  res.status(200).json({
    success: true,
    data: classes
  });
});

// @desc    Get attendance data
// @route   GET /api/dashboard/attendance
// @access  Private
exports.getAttendanceData = asyncHandler(async (req, res, next) => {
  const { startDate, endDate, classId } = req.query;
  
  const attendance = await Attendance.find({
    date: {
      $gte: startDate,
      $lte: endDate
    },
    ...(classId && { class: classId })
  }).populate('student', 'name');

  res.status(200).json({
    success: true,
    data: attendance
  });
});

// Helper functions
async function getAdminStats() {
  const totalStudents = await Student.countDocuments();
  const totalTeachers = await Teacher.countDocuments();
  const totalClasses = await Class.countDocuments();
  // Add more admin stats calculations

  return {
    totalStudents,
    totalTeachers,
    totalClasses,
    // Add more stats
  };
}

async function getTeacherStats(teacherId) {
  const teacher = await Teacher.findById(teacherId);
  // Add teacher specific stats calculations

  return {
    totalClasses: teacher.classes.length,
    // Add more stats
  };
}

async function getStudentStats(studentId) {
  const student = await Student.findById(studentId);
  // Add student specific stats calculations

  return {
    attendance: 95, // Calculate actual attendance
    // Add more stats
  };
} 