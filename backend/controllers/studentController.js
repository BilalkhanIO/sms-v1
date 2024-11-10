import Student from '../models/Student.js';
import User from '../models/User.js';
import { catchAsync } from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

// Get all students with filters and pagination
export const getAllStudents = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.class) filter.currentClass = req.query.class;
  if (req.query.status) filter.status = req.query.status;
  if (req.query.search) {
    filter.$or = [
      { firstName: { $regex: req.query.search, $options: 'i' } },
      { lastName: { $regex: req.query.search, $options: 'i' } },
      { rollNumber: { $regex: req.query.search, $options: 'i' } },
    ];
  }

  const students = await Student.find(filter)
    .populate('currentClass', 'name section')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await Student.countDocuments(filter);

  res.status(200).json({
    status: 'success',
    data: {
      students,
      total,
      page,
      pages: Math.ceil(total / limit)
    }
  });
});

// Get single student
export const getStudent = catchAsync(async (req, res) => {
  const student = await Student.findById(req.params.id)
    .populate('currentClass')
    .populate('academicRecords.subjects.subject');

  if (!student) {
    throw new AppError('Student not found', 404);
  }

  res.status(200).json({
    status: 'success',
    data: { student }
  });
});

// Create new student
export const createStudent = catchAsync(async (req, res) => {
  // Create user account first
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: 'STUDENT',
  });

  // Create student profile
  const student = await Student.create({
    user: user._id,
    ...req.body,
  });

  res.status(201).json({
    success: true,
    data: student,
  });
});

// Update student
export const updateStudent = catchAsync(async (req, res) => {
  if (req.body.currentClass) {
    const classExists = await Class.findById(req.body.currentClass);
    if (!classExists) {
      throw new AppError('Invalid class ID', 400);
    }
  }

  const student = await Student.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!student) {
    throw new AppError('Student not found', 404);
  }

  res.status(200).json({
    status: 'success',
    data: { student }
  });
});

// Delete student
export const deleteStudent = catchAsync(async (req, res) => {
  const student = await Student.findById(req.params.id);
  
  if (!student) {
    throw new AppError('Student not found', 404);
  }

  // Remove student from class
  await Class.findByIdAndUpdate(student.currentClass, {
    $pull: { students: student._id }
  });

  await student.remove();

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Add academic record
export const addAcademicRecord = catchAsync(async (req, res) => {
  const student = await Student.findByIdAndUpdate(
    req.params.id,
    { $push: { academicRecords: req.body } },
    { new: true, runValidators: true }
  );

  if (!student) {
    throw new AppError('Student not found', 404);
  }

  res.status(200).json({
    status: 'success',
    data: { student }
  });
});

// Mark attendance
export const markAttendance = catchAsync(async (req, res) => {
  const student = await Student.findByIdAndUpdate(
    req.params.id,
    { $push: { attendance: req.body } },
    { new: true, runValidators: true }
  );

  if (!student) {
    throw new AppError('Student not found', 404);
  }

  res.status(200).json({
    status: 'success',
    data: { student }
  });
});

// Get attendance report
export const getAttendanceReport = catchAsync(async (req, res) => {
  const student = await Student.findById(req.params.id);
  
  if (!student) {
    throw new AppError('Student not found', 404);
  }

  const { startDate, endDate } = req.query;
  const attendance = student.calculateAttendance(
    new Date(startDate),
    new Date(endDate)
  );

  res.status(200).json({
    status: 'success',
    data: { attendance }
  });
});

// Add fee record
export const addFeeRecord = catchAsync(async (req, res, next) => {
  const student = await Student.findById(req.params.id);

  if (!student) {
    return next(new AppError('No student found with that ID', 404));
  }

  student.feeRecords.push(req.body);
  await student.save();

  res.status(200).json({
    status: 'success',
    data: { student }
  });
});

// Get student attendance report
export const getAttendanceReport = catchAsync(async (req, res, next) => {
  const { startDate, endDate } = req.query;
  const student = await Student.findById(req.params.id);

  if (!student) {
    return next(new AppError('No student found with that ID', 404));
  }

  const attendancePercentage = student.calculateAttendancePercentage(
    new Date(startDate),
    new Date(endDate)
  );

  res.status(200).json({
    status: 'success',
    data: {
      studentId: student._id,
      attendancePercentage,
      period: { startDate, endDate }
    }
  });
});

// Get fee status
export const getFeeStatus = catchAsync(async (req, res, next) => {
  const student = await Student.findById(req.params.id);

  if (!student) {
    return next(new AppError('No student found with that ID', 404));
  }

  const hasPendingFees = student.hasPendingFees();

  res.status(200).json({
    status: 'success',
    data: {
      studentId: student._id,
      hasPendingFees,
      feeRecords: student.feeRecords
    }
  });
});

// Update student academic records
export const updateAcademicRecords = catchAsync(async (req, res, next) => {
  const student = await Student.findById(req.params.id);
  if (!student) {
    return next(new AppError('No student found with that ID', 404));
  }

  student.academicRecords.push(req.body);
  await student.save();

  res.status(200).json({
    status: 'success',
    data: { student }
  });
});

// Get student academic performance
export const getAcademicPerformance = catchAsync(async (req, res, next) => {
  const student = await Student.findById(req.params.id)
    .populate('academicRecords.subjects.subject');

  if (!student) {
    return next(new AppError('No student found with that ID', 404));
  }

  const performance = {
    overall: calculateOverallPerformance(student.academicRecords),
    subjectWise: calculateSubjectWisePerformance(student.academicRecords),
    trends: calculatePerformanceTrends(student.academicRecords)
  };

  res.status(200).json({
    status: 'success',
    data: { performance }
  });
});

// Get student profile
export const getStudentProfile = catchAsync(async (req, res) => {
  const student = await Student.findOne({ user: req.user.id })
    .populate('class')
    .populate('user', '-password');

  if (!student) {
    throw new AppError('Student profile not found', 404);
  }

  res.json({
    success: true,
    data: student,
  });
});

// Update student profile
export const updateStudentProfile = catchAsync(async (req, res) => {
  const student = await Student.findOneAndUpdate(
    { user: req.user.id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!student) {
    throw new AppError('Student profile not found', 404);
  }

  res.json({
    success: true,
    data: student,
  });
});

// Generate student report
export const generateStudentReport = catchAsync(async (req, res) => {
  const student = await Student.findById(req.params.id)
    .populate('class')
    .populate('user', '-password');

  if (!student) {
    throw new AppError('Student not found', 404);
  }

  // Generate PDF report
  const report = await generatePDFReport(student);

  res.json({
    success: true,
    data: {
      reportUrl: report.url,
    },
  });
});