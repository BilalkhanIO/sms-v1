const catchAsync = require('../utils/catchAsync');
const errorHandler = require('../utils/errorHandler');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Class = require('../models/Class');
const Attendance = require('../models/Attendance');
const Activity = require('../models/Activity');
const Exam = require('../models/Exam');

// @desc    Get dashboard stats based on role
// @route   GET /api/dashboard/stats/:role
// @access  Private
const getStats = catchAsync(async (req, res, next) => {
  const { role } = req.params;
  
  // Check if user exists in request
  if (!req.user) {
    return next(new errorHandler('User not authenticated', 401));
  }

  let stats;

  switch (role.toUpperCase()) {
    case 'STUDENT':
      stats = await getStudentStats(req.user.id);
      break;
    case 'TEACHER':
      stats = await getTeacherStats(req.user.id);
      break;
    case 'SUPER_ADMIN':
    case 'SCHOOL_ADMIN':
      stats = await getAdminStats();
      break;
    default:
      return next(new errorHandler('Invalid role specified', 400));
  }

  res.status(200).json({
    success: true,
    data: stats
  });
});

// @desc    Get recent activities
// @route   GET /api/dashboard/activities
// @access  Private
const getRecentActivities = catchAsync(async (req, res) => {
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
const getUpcomingClasses = catchAsync(async (req, res) => {
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

// Helper functions for getting role-specific stats
async function getStudentStats(userId) {
  const student = await Student.findOne({ user: userId })
    .populate('class')
    .populate('academicRecords.subjects.subject');

  const attendance = await Attendance.find({ student: student._id })
    .sort('-date')
    .limit(30);

  const attendanceRate = calculateAttendanceRate(attendance);
  const academicPerformance = calculateAcademicPerformance(student.academicRecords);
  const upcomingExams = await getUpcomingExams(student.class);

  return {
    attendance: {
      rate: attendanceRate,
      present: attendance.filter(a => a.status === 'PRESENT').length,
      absent: attendance.filter(a => a.status === 'ABSENT').length,
      late: attendance.filter(a => a.status === 'LATE').length
    },
    academics: {
      overallGrade: academicPerformance.overallGrade,
      gradePercentage: academicPerformance.percentage,
      subjectWisePerformance: academicPerformance.subjectWise
    },
    upcomingExams: upcomingExams,
    assignments: await getAssignmentStats(student._id),
    recentActivities: await getStudentActivities(student._id)
  };
}

async function getTeacherStats(userId) {
  const teacher = await Teacher.findOne({ user: userId });
  const totalStudents = await Student.countDocuments({ 
    currentClass: { $in: teacher.assignedClasses } 
  });
  const todayClasses = await Class.countDocuments({ 
    teacher: teacher._id,
    date: { 
      $gte: new Date().setHours(0,0,0,0),
      $lt: new Date().setHours(23,59,59,999)
    }
  });

  return {
    totalStudents,
    todayClasses,
    attendanceRate: await calculateClassAttendanceRate(teacher.assignedClasses),
    pendingTasks: await getPendingTasks(teacher._id),
    recentSubmissions: await getRecentSubmissions(teacher.assignedClasses),
    upcomingClasses: await getUpcomingClasses(teacher._id),
    classPerformance: await getClassPerformance(teacher.assignedClasses)
  };
}

async function getAdminStats() {
  const totalStudents = await Student.countDocuments();
  const totalTeachers = await Teacher.countDocuments();
  const totalClasses = await Class.countDocuments();
  const feeCollection = await calculateFeeCollection();
  const attendanceOverview = await getAttendanceOverview();

  return {
    overview: {
      totalStudents,
      totalTeachers,
      totalClasses,
      activeStudents: await Student.countDocuments({ status: 'ACTIVE' })
    },
    attendance: attendanceOverview,
    feeCollection: {
      total: feeCollection.total,
      pending: feeCollection.pending,
      thisMonth: feeCollection.thisMonth,
      collectionRate: feeCollection.rate
    },
    performance: await getOverallPerformance(),
    recentActivities: await getAdminActivities()
  };
}

// Helper utility functions
function calculateAttendanceRate(attendance) {
  if (!attendance.length) return 0;
  const present = attendance.filter(a => a.status === 'PRESENT').length;
  return (present / attendance.length) * 100;
}

function calculateAcademicPerformance(records) {
  // Implement grade calculation logic
  return {
    overallGrade: 'A',
    percentage: 85,
    subjectWise: []
  };
}

async function getUpcomingExams(classId) {
  return await Exam.find({
    class: classId,
    date: { $gte: new Date() }
  })
    .sort('date')
    .limit(5)
    .populate('subject', 'name');
}

// Add more helper functions as needed

module.exports = {
  getStats,
  getRecentActivities,
  getUpcomingClasses,
 
}; 