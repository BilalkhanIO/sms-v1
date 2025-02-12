// controllers/studentController.js
import Student from '../models/Student.js';
import asyncHandler from 'express-async-handler';
import Activity from '../models/Activity.js';

// @desc    Create student profile
// @route   POST /api/students
// @access  Private/Admin
const createStudent = asyncHandler(async (req, res) => {
  const { admissionNumber, rollNumber, class: classId } = req.body;

  const existingStudent = await Student.findOne({ admissionNumber });
  if (existingStudent) {
    res.status(400);
    throw new Error('Admission number already exists');
  }

  const student = await Student.create({
    ...req.body,
    class: classId,
    status: 'ACTIVE'
  });

  await Activity.logActivity({
    userId: req.user.id,
    type: 'PROFILE_UPDATED',
    description: `Student profile created for ${admissionNumber}`,
    metadata: { studentId: student._id },
    ip: req.ip,
    userAgent: req.headers['user-agent']
  });

  res.status(201).json(student);
});

// @desc    Get students by class
// @route   GET /api/students/class/:classId
// @access  Private
const getStudentsByClass = asyncHandler(async (req, res) => {
  const students = await Student.find({ class: req.params.classId })
    .populate('class', 'name section')
    .populate('user', 'firstName lastName email');

  res.json(students);
});

export { createStudent, getStudentsByClass };