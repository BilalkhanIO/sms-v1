const StatsCalculator = require('../utils/statsCalculator');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Class = require('../models/Class');
const Attendance = require('../models/Attendance');
const Activity = require('../models/Activity');
const Exam = require('../models/Exam');
const Fee = require('../models/Fee');

// @desc    Get dashboard stats based on role
// @route   GET /api/dashboard/stats/:role
// @access  Private
const getStats = catchAsync(async (req, res, next) => {
  if (!req.user?.id) {
    return next(new AppError('Not authenticated', 401));
  }

  const requestedRole = req.params.role.toUpperCase();
  const userRole = req.user.role.toUpperCase();

  // Role validation
  const allowedRoles = {
    'SUPER_ADMIN': ['SUPER_ADMIN'],
    'SCHOOL_ADMIN': ['SUPER_ADMIN', 'SCHOOL_ADMIN'],
    'TEACHER': ['TEACHER'],
    'STUDENT': ['STUDENT']
  };

  if (!allowedRoles[requestedRole]?.includes(userRole)) {
    return next(new AppError('Unauthorized access', 403));
  }

  let stats;
  try {
    switch (requestedRole) {
      case 'SUPER_ADMIN':
      case 'SCHOOL_ADMIN':
        stats = await getAdminStats();
        break;
      case 'TEACHER':
        stats = await getTeacherStats(req.user.id);
        break;
      case 'STUDENT':
        stats = await getStudentStats(req.user.id);
        break;
      default:
        return next(new AppError('Invalid role', 400));
    }

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
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
  const student = await User.findOne({ user: userId });
if(student.student)
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
  const [
    feeStats,
    attendanceStats,
    performanceStats,
    recentActivities
  ] = await Promise.all([
    StatsCalculator.calculateFeeStats(),
    StatsCalculator.calculateAttendanceStats(),
    StatsCalculator.calculatePerformanceStats(),
    StatsCalculator.getRecentActivities()
  ]);

  const [totalStudents, totalTeachers, totalClasses] = await Promise.all([
    Student.countDocuments(),
    Teacher.countDocuments(),
    Class.countDocuments()
  ]);

  return {
    overview: {
      totalStudents,
      totalTeachers,
      totalClasses,
      activeStudents: await Student.countDocuments({ status: 'ACTIVE' })
    },
    feeCollection: feeStats,
    attendance: attendanceStats,
    performance: performanceStats,
    recentActivities
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

const calculateFeeCollection = async () => {
  try {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    // Get all fee records
    const feeRecords = await Fee.find({
      createdAt: {
        $gte: new Date(currentYear, 0, 1), // Start of current year
        $lte: currentDate
      }
    });

    // Calculate total collection
    const total = feeRecords.reduce((acc, fee) => acc + (fee.paidAmount || 0), 0);

    // Calculate pending amount
    const pending = feeRecords.reduce((acc, fee) => {
      const pendingAmount = fee.amount - (fee.paidAmount || 0);
      return acc + (pendingAmount > 0 ? pendingAmount : 0);
    }, 0);

    // Calculate this month's collection
    const thisMonth = feeRecords
      .filter(fee => {
        const feeMonth = new Date(fee.paidDate).getMonth() + 1;
        const feeYear = new Date(fee.paidDate).getFullYear();
        return feeMonth === currentMonth && feeYear === currentYear;
      })
      .reduce((acc, fee) => acc + (fee.paidAmount || 0), 0);

    // Calculate collection rate
    const rate = total > 0 ? ((total / (total + pending)) * 100).toFixed(2) : 0;

    return {
      total,
      pending,
      thisMonth,
      rate: parseFloat(rate)
    };
  } catch (error) {
    console.error('Error calculating fee collection:', error);
    return {
      total: 0,
      pending: 0,
      thisMonth: 0,
      rate: 0
    };
  }
};

const getAttendanceOverview = async () => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const attendance = await Attendance.find({
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    });

    const total = attendance.length;
    const present = attendance.filter(a => a.status === 'PRESENT').length;
    const absent = attendance.filter(a => a.status === 'ABSENT').length;
    const late = attendance.filter(a => a.status === 'LATE').length;

    return {
      total,
      present,
      absent,
      late,
      rate: total > 0 ? ((present / total) * 100).toFixed(2) : 0
    };
  } catch (error) {
    console.error('Error calculating attendance overview:', error);
    return {
      total: 0,
      present: 0,
      absent: 0,
      late: 0,
      rate: 0
    };
  }
};

const getOverallPerformance = async () => {
  try {
    // Get all exam results
    const examResults = await Exam.find({
      status: 'COMPLETED'
    }).populate('results');

    // Calculate average performance
    let totalScore = 0;
    let totalStudents = 0;

    examResults.forEach(exam => {
      exam.results.forEach(result => {
        totalScore += (result.obtainedMarks / exam.totalMarks) * 100;
        totalStudents++;
      });
    });

    const averagePerformance = totalStudents > 0 
      ? (totalScore / totalStudents).toFixed(2)
      : 0;

    return {
      averagePerformance: parseFloat(averagePerformance),
      totalExams: examResults.length,
      totalParticipants: totalStudents
    };
  } catch (error) {
    console.error('Error calculating overall performance:', error);
    return {
      averagePerformance: 0,
      totalExams: 0,
      totalParticipants: 0
    };
  }
};

module.exports = {
  getStats,
  getRecentActivities,
  getUpcomingClasses,
 
}; 