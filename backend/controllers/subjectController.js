// controllers/subjectController.js
import Subject from '../models/Subject.js';
import asyncHandler from 'express-async-handler';

// @desc    Create new subject
// @route   POST /api/subjects
// @access  Private/Admin
const createSubject = asyncHandler(async (req, res) => {
  const { code, name } = req.body;

  const existingSubject = await Subject.findOne({ code });
  if (existingSubject) {
    res.status(400);
    throw new Error('Subject code already exists');
  }

  const subject = await Subject.create(req.body);
  res.status(201).json(subject);
});

// @desc    Assign teacher to subject
// @route   PUT /api/subjects/:id/teachers
// @access  Private/Admin
const assignTeacher = asyncHandler(async (req, res) => {
  const { teacherId } = req.body;
  
  const subject = await Subject.findById(req.params.id);
  if (!subject) {
    res.status(404);
    throw new Error('Subject not found');
  }

  if (!subject.assignedTeachers.includes(teacherId)) {
    subject.assignedTeachers.push(teacherId);
    await subject.save();
  }

  res.json(subject);
});

export { createSubject, assignTeacher };