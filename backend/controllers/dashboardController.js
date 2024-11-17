const catchAsync = require('../utils/catchAsync');
const errorHandler = require('../utils/errorHandler');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Class = require('../models/Class');
const Attendance = require('../models/Attendance');
const Activity = require('../models/Activity');
const Exam = require('../models/Exam');
const AppError = require('../utils/appError');

// @desc    Get dashboard stats based on role
// @route   GET /api/dashboard/stats/:role
// @access  Private
const getStats = catchAsync(async (req, res, next) => {
  if (!req.user || !req.user.id) {
    return next(new AppError('User not authenticated', 401));
  }

  const { role } = req.params;
  
  if (role.toUpperCase() !== req.user.role) {
    return next(new AppError('Unauthorized access: Role mismatch', 403));
  }

  let stats;
  try {
    switch (role.toUpperCase()) {
      case 'STUDENT':
        const student = await Student.findOne({ user: req.user.id });
        if (!student) {
          return next(new AppError('Student profile not found', 404));
        }
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
        return next(new AppError('Invalid role specified', 400));
    }

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    return next(error);
  }
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
const getStudentStats = catchAsync(async (userId) => {
  const student = await Student.findOne({ user: userId })
    .populate('class')
    .populate('academicRecords.subjects.subject');

  if (!student) {
    throw new AppError('Student record not found', 404);
  }

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
});

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