// controllers/classController.js
import ClassModel from "../models/Class.js";
import Teacher from "../models/Teacher.js";
import Student from "../models/Student.js";
import asyncHandler from "express-async-handler";
import { body, validationResult } from 'express-validator';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { successResponse, errorResponse } from "../utils/apiResponse.js";
import Activity from "../models/Activity.js";

// @desc     Get all classes
// @route   GET /api/classes
// @access  Private (Admin, Teacher, Student)
const getClasses = [
    protect, // Protect the route
    authorize('SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER', 'STUDENT'), // Allow admin, teachers and students
    asyncHandler(async (req, res) => {
      let query = {};
      if (req.schoolId) {
        query.school = req.schoolId;
      }

      if (req.user.role === 'TEACHER') {
          const teacher = await Teacher.findOne({ user: req.user._id, school: req.schoolId });
          if (!teacher) return successResponse(res, [], 'Classes retrieved successfully');
          query = {
              school: req.schoolId,
              $or: [
                  { classTeacher: teacher._id },
                  { subjects: { $in: teacher.assignedSubjects || [] } }
              ]
          };
      }

      if (req.user.role === 'STUDENT') {
          const student = await Student.findOne({ user: req.user._id, school: req.schoolId });
          if (!student) return successResponse(res, [], 'Classes retrieved successfully');
          query = { students: student._id };
      }

      const classes = await ClassModel.find(query)
        .populate({ path: 'classTeacher', select: 'user employeeId', populate: { path: 'user', select: 'firstName lastName' } })
        .sort({ academicYear: 'desc', name: 'asc', section: 'asc' });
        return successResponse(res, classes, "Classes retrieved successfully");

    })
];

// @desc     Get class by ID
// @route   GET /api/classes/:id
// @access  Private (Admin, Teacher, Student)
const getClassById = [
    protect,
    authorize('SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER', 'STUDENT'),
    asyncHandler(async (req, res) => {
        const classId = req.params.id;
        const filter = { _id: classId };
        if (req.schoolId) {
          filter.school = req.schoolId;
        }
        const classData = await ClassModel.findOne(filter)
            .populate({ path: 'classTeacher', select: 'user employeeId', populate: { path: 'user', select: 'firstName lastName' } })
            .populate('subjects', 'name code')
            .populate({ path: 'students', select: 'admissionNumber user', populate: { path: 'user', select: 'firstName lastName' } })
            .populate('schedule.periods.subject', 'name code')
            .populate({ path: 'schedule.periods.teacher', select: 'user employeeId', populate: { path: 'user', select: 'firstName lastName' } });

        if (!classData) {
            return errorResponse(res, 'Class not found', 404);
        }

        if (req.user.role === 'TEACHER') {
            const teacher = await Teacher.findOne({ user: req.user._id });
            if (!teacher || !classData.classTeacher?._id?.equals(teacher._id)) {
                return errorResponse(res, 'Unauthorized to access this class', 403);
            }
        }

        if (req.user.role === 'STUDENT') {
            const student = await Student.findOne({ user: req.user._id });
            if (!student || !classData.students.some(s => s._id.equals(student._id))) {
                return errorResponse(res, 'Unauthorized to access this class', 403);
            }
        }

        return successResponse(res, classData, "Class retrieved successfully");
    })
];

// @desc     Create a new class
// @route   POST /api/classes
// @access  Private/Admin
const createClass = [
  protect,
  authorize('SUPER_ADMIN', 'SCHOOL_ADMIN'),
  // Validation rules
  body('name').notEmpty().withMessage('Class name is required'),
  body('section').notEmpty().withMessage('Section is required'),
  body('academicYear').notEmpty().withMessage('Academic year is required'),
  body('classTeacher').notEmpty().withMessage('Class teacher is required').isMongoId().withMessage('Invalid class teacher ID'),
  body('subjects').isArray({ min: 1 }).withMessage('At least one subject must be assigned'),
  body('subjects.*').isMongoId().withMessage('Invalid subject ID'),
  body('schedule').optional().isArray().withMessage('Schedule must be an array'),

  asyncHandler(async (req, res) => {
      // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return errorResponse(res, "Validation failed", 400, errors.array());
    }

    const { name, section, academicYear, classTeacher, subjects, schedule } = req.body;

    // Check if a class with the same name, section, and academic year already exists
    const classExists = await ClassModel.findOne({ name, section, academicYear });
    if (classExists) {
        return errorResponse(res, 'A class with this name, section, and academic year already exists', 400);
    }

    // Create the class
    const classData = await ClassModel.create({
      school: req.schoolId,
      name,
      section,
      academicYear,
      classTeacher,
      subjects,
      schedule,
    });

    if (classData) {
      // Log activity
        await Activity.logActivity({
          userId: req.user._id,
          type: 'CLASS_CREATED',
          description: `Created class ${classData.name} ${classData.section} (${classData.academicYear})`,
          context: 'class-management',
          ip: req.ip,
          userAgent: req.headers['user-agent']
        });
        return successResponse(res, classData, "Class created successfully", 201);

    } else {
        return errorResponse(res, 'Invalid class data', 400);

    }
  })
];

// @desc     Update a class
// @route   PUT /api/classes/:id
// @access  Private/Admin
const updateClass = [
  protect,
  authorize('SUPER_ADMIN', 'SCHOOL_ADMIN'),
  // Validation rules (optional fields)
  body('name').optional().notEmpty().withMessage('Class name is required'),
  body('section').optional().notEmpty().withMessage('Section is required'),
  body('academicYear').optional().notEmpty().withMessage('Academic year is required'),
  body('classTeacher').optional().notEmpty().withMessage('Class teacher is required').isMongoId().withMessage('Invalid class teacher ID'),
  body('subjects').optional().isArray({ min: 1 }).withMessage('At least one subject must be assigned'),
  body('subjects.*').isMongoId().withMessage('Invalid subject ID'),
  body('schedule').optional().isArray().withMessage('Schedule must be an array'),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return errorResponse(res, "Validation failed", 400, errors.array());
    }

    const classData = await ClassModel.findOne({
      _id: req.params.id,
      school: req.schoolId,
    });

    if (!classData) {
        return errorResponse(res, 'Class not found', 404);
    }
      const updateData = {
        name: req.body.name || classData.name,
        section: req.body.section || classData.section,
        academicYear: req.body.academicYear || classData.academicYear,
        classTeacher: req.body.classTeacher || classData.classTeacher,
        subjects: req.body.subjects || classData.subjects,
        schedule: req.body.schedule || classData.schedule
      }
    // Use findOneAndUpdate for atomic operation and pre-save hooks.
    const updatedClass = await ClassModel.findOneAndUpdate(
      { _id: req.params.id },
      updateData,
      { new: true, runValidators: true } // Return updated document, run schema validators
    );


      // Log activity
      await Activity.logActivity({
        userId: req.user._id,
        type: 'CLASS_UPDATED',
        description: `Updated class ${updatedClass.name} ${updatedClass.section} (${updatedClass.academicYear})`,
        context: 'class-management',
        ip: req.ip,
        userAgent: req.headers['user-agent']
    });
    return successResponse(res, updatedClass, "Class updated successfully");
  })
];

// @desc     Delete a class
// @route   DELETE /api/classes/:id
// @access  Private/Admin
const deleteClass = [
  protect,
  authorize('SUPER_ADMIN', 'SCHOOL_ADMIN'),
  asyncHandler(async (req, res) => {
    const classData = await ClassModel.findOne({
      _id: req.params.id,
      school: req.schoolId,
    });

    if (!classData) {
        return errorResponse(res, 'Class not found', 404);

    }

    await ClassModel.deleteOne({ _id: req.params.id });

      // Log activity
    await Activity.logActivity({
      userId: req.user._id,
      type: 'CLASS_DELETED',
      description: `Deleted class ${classData.name} ${classData.section} (${classData.academicYear})`,
      context: 'class-management',
      ip: req.ip,
      userAgent: req.headers['user-agent']
    });
    return successResponse(res, null, "Class removed successfully");
  })
];

export { getClasses, getClassById, createClass, updateClass, deleteClass };