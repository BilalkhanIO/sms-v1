// controllers/classController.js
import ClassModel from '../models/Class.js';
import asyncHandler from 'express-async-handler';
import Activity from '../models/Activity.js';

// @desc    Create new class
// @route   POST /api/classes
// @access  Private/Admin
const createClass = asyncHandler(async (req, res) => {
  const { name, section, academicYear, classTeacher } = req.body;

  const existingClass = await ClassModel.findOne({ 
    name, 
    section, 
    academicYear 
  });

  if (existingClass) {
    res.status(400);
    throw new Error('Class already exists');
  }

  const newClass = await ClassModel.create({
    name,
    section,
    academicYear,
    classTeacher,
    subjects: [],
    students: [],
    schedule: []
  });

  // Log activity
  await Activity.logActivity({
    userId: req.user.id,
    type: 'SYSTEM',
    description: `Class ${name}-${section} created for ${academicYear}`,
    ip: req.ip,
    userAgent: req.headers['user-agent']
  });

  res.status(201).json(newClass);
});

// @desc    Add student to class
// @route   PUT /api/classes/:id/students
// @access  Private/Admin
const addStudentToClass = asyncHandler(async (req, res) => {
  const { studentId } = req.body;
  const classObj = await ClassModel.findById(req.params.id);
  
  if (!classObj) {
    res.status(404);
    throw new Error('Class not found');
  }

  if (classObj.students.includes(studentId)) {
    res.status(400);
    throw new Error('Student already in class');
  }

  classObj.students.push(studentId);
  await classObj.save();

  res.json(classObj);
});

export { createClass, addStudentToClass };