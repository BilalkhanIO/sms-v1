// src/controllers/classController.js
import ClassModel from '../models/Class.js';
import asyncHandler from 'express-async-handler';
import Activity from '../models/Activity.js';

// @desc    Get all classes
// @route   GET /api/classes
// @access  Private/Admin
const getClasses = asyncHandler(async (req, res) => {
  const classes = await ClassModel.find().populate('classTeacher', 'user').populate('subjects.subject'); // Populate teacher and subjects

  res.json(classes);
});

// @desc    Get single class by ID
// @route   GET /api/classes/:id
// @access  Private/Admin
const getClassById = asyncHandler(async (req, res) => {
  const classObj = await ClassModel.findById(req.params.id)
      .populate('classTeacher', 'user') // Populate user for classTeacher
      .populate('subjects.subject') // Populate subject// Populate user for teacher in subjects
      .populate('students', 'user'); // Populate user for each student

  if (!classObj) {
    res.status(404);
    throw new Error('Class not found');
  }

  res.json(classObj);
});


// @desc    Create new class
// @route   POST /api/classes
// @access  Private/Admin
const createClass = asyncHandler(async (req, res) => {
  const { name, section, academicYear, classTeacher, subjects = [], schedule = [] } = req.body;

  const existingClass = await ClassModel.findOne({ name, section, academicYear });
  if (existingClass) {
    res.status(400);
    throw new Error('Class already exists');
  }

  const newClass = await ClassModel.create({
    name, section, academicYear, classTeacher, subjects, schedule
  });

  await Activity.logActivity({ // Log activity
    userId: req.user._id,
    type: 'CLASS_CREATED',
    description: `Class ${name}-${section} created for ${academicYear}`,
    ip: req.ip,
    userAgent: req.headers['user-agent']
  });

  res.status(201).json(newClass);
});


// @desc    Update class
// @route   PUT /api/classes/:id
// @access  Private/Admin
const updateClass = asyncHandler(async (req, res) => {
  const { name, section, academicYear, classTeacher, subjects, schedule } = req.body;

  const classObj = await ClassModel.findById(req.params.id);

  if (!classObj) {
    res.status(404);
    throw new Error('Class not found');
  }

  classObj.name = name || classObj.name;
  classObj.section = section || classObj.section;
  classObj.academicYear = academicYear || classObj.academicYear;
  classObj.classTeacher = classTeacher || classObj.classTeacher;
  classObj.subjects = subjects || classObj.subjects;
  classObj.schedule = schedule || classObj.schedule;

  const updatedClass = await classObj.save();

  await Activity.logActivity({
    userId: req.user._id,
    type: 'CLASS_UPDATED',
    description: `Class ${classObj.name}-${classObj.section} updated`,
    ip: req.ip,
    userAgent: req.headers['user-agent']
  });

  res.json(updatedClass);
});

// @desc    Delete class
// @route   DELETE /api/classes/:id
// @access  Private/Admin
const deleteClass = asyncHandler(async (req, res) => {
  const classObj = await ClassModel.findById(req.params.id);

  if (!classObj) {
    res.status(404);
    throw new Error('Class not found');
  }

  await classObj.remove();

  await Activity.logActivity({
    userId: req.user._id,
    type: 'CLASS_DELETED',
    description: `Class ${classObj.name}-${classObj.section} deleted`,
    ip: req.ip,
    userAgent: req.headers['user-agent']
  });

  res.status(200).json({ message: 'Class deleted successfully' });
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

// @desc    Remove student from class
// @route   DELETE /api/classes/:id/students/:studentId
// @access  Private/Admin
const removeStudentFromClass = asyncHandler(async (req, res) => {
  const { id, studentId } = req.params;
  const classObj = await ClassModel.findById(id);

  if (!classObj) {
    res.status(404);
    throw new Error('Class not found');
  }

  classObj.students = classObj.students.filter(student => student.toString() !== studentId); // Filter out the student
  await classObj.save();

  res.json(classObj);
});


export {
  getClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
  addStudentToClass,
  removeStudentFromClass,
};