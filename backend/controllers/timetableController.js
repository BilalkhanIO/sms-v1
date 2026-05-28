// controllers/timetableController.js
import Timetable from '../models/Timetable.js';
import Teacher from '../models/Teacher.js';
import Student from '../models/Student.js';
import asyncHandler from 'express-async-handler';
import { body, validationResult } from 'express-validator';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import Activity from '../models/Activity.js';
import mongoose from 'mongoose';

// ---------------------------------------------------------------------------
// @desc    Get active timetable for a specific class
// @route   GET /api/timetables/class/:classId
// @access  Private (all authenticated roles)
// ---------------------------------------------------------------------------
export const getTimetableByClass = [
  protect,
  authorize('SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER', 'STUDENT', 'PARENT'),
  asyncHandler(async (req, res) => {
    const { classId } = req.params;

    const filter = { class: classId, isActive: true };
    if (req.schoolId) {
      filter.school = req.schoolId;
    }

    const timetable = await Timetable.findOne(filter)
      .populate('class', 'name section')
      .populate('academicYear', 'name')
      .populate('schedule.periods.subject', 'name code')
      .populate({
        path: 'schedule.periods.teacher',
        populate: { path: 'user', select: 'firstName lastName' },
      })
      .lean();

    if (!timetable) {
      return errorResponse(res, 'No active timetable found for this class', 404);
    }

    return successResponse(res, timetable, 'Timetable retrieved successfully');
  }),
];

// ---------------------------------------------------------------------------
// @desc    Get all periods for a teacher across all classes
// @route   GET /api/timetables/teacher/:teacherId
// @access  Private (SUPER_ADMIN, SCHOOL_ADMIN, TEACHER)
// ---------------------------------------------------------------------------
export const getTimetableByTeacher = [
  protect,
  authorize('SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER'),
  asyncHandler(async (req, res) => {
    const { teacherId } = req.params;

    const filter = { isActive: true };
    if (req.schoolId) {
      filter.school = req.schoolId;
    }

    // Find all active timetables for this school that contain at least one
    // period assigned to the specified teacher.
    const timetables = await Timetable.find({
      ...filter,
      'schedule.periods.teacher': teacherId,
    })
      .populate('class', 'name section')
      .populate('academicYear', 'name')
      .populate('schedule.periods.subject', 'name code')
      .populate({
        path: 'schedule.periods.teacher',
        populate: { path: 'user', select: 'firstName lastName' },
      })
      .lean();

    // Narrow each timetable's schedule to only the periods belonging to this teacher
    const result = timetables.map((tt) => ({
      ...tt,
      schedule: tt.schedule.map((day) => ({
        ...day,
        periods: day.periods.filter(
          (p) => p.teacher && p.teacher._id.toString() === teacherId.toString()
        ),
      })).filter((day) => day.periods.length > 0),
    }));

    return successResponse(res, result, "Teacher's timetable retrieved successfully");
  }),
];

// ---------------------------------------------------------------------------
// @desc    Create a timetable for a class (checks for teacher period conflicts)
// @route   POST /api/timetables
// @access  Private (SUPER_ADMIN, SCHOOL_ADMIN)
// ---------------------------------------------------------------------------
export const createTimetable = [
  protect,
  authorize('SUPER_ADMIN', 'SCHOOL_ADMIN'),

  body('class')
    .notEmpty().withMessage('Class ID is required')
    .isMongoId().withMessage('Invalid Class ID'),
  body('effectiveFrom')
    .isISO8601().withMessage('Invalid effectiveFrom date').toDate(),
  body('effectiveTo')
    .optional()
    .isISO8601().withMessage('Invalid effectiveTo date').toDate(),
  body('academicYear')
    .optional()
    .isMongoId().withMessage('Invalid Academic Year ID'),
  body('schedule')
    .isArray({ min: 1 }).withMessage('Schedule must be a non-empty array'),
  body('schedule.*.day')
    .notEmpty().withMessage('Day is required for each schedule entry')
    .isIn(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'])
    .withMessage('Invalid day value'),
  body('schedule.*.periods')
    .isArray().withMessage('Periods must be an array'),
  body('schedule.*.periods.*.periodNumber')
    .isInt({ min: 1 }).withMessage('Period number must be a positive integer'),
  body('schedule.*.periods.*.startTime')
    .notEmpty().withMessage('Start time is required'),
  body('schedule.*.periods.*.endTime')
    .notEmpty().withMessage('End time is required'),
  body('schedule.*.periods.*.type')
    .optional()
    .isIn(['LESSON', 'BREAK', 'LUNCH', 'FREE']).withMessage('Invalid period type'),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Validation failed', 400, errors.array());
    }

    const schoolId = req.schoolId;
    if (!schoolId) {
      return errorResponse(res, 'School context is required', 400);
    }

    const { class: classId, academicYear, effectiveFrom, effectiveTo, schedule } = req.body;

    // Collect every (day, startTime, endTime, teacherId) tuple that is a LESSON
    // so we can detect conflicts with other timetables in the same school.
    const teacherSlots = [];
    for (const dayEntry of schedule) {
      for (const period of dayEntry.periods || []) {
        if (period.teacher && period.type !== 'BREAK' && period.type !== 'LUNCH') {
          teacherSlots.push({
            day: dayEntry.day,
            teacher: period.teacher,
            startTime: period.startTime,
            endTime: period.endTime,
          });
        }
      }
    }

    // Check teacher conflicts against all other active timetables for the school
    if (teacherSlots.length > 0) {
      const teacherIds = [...new Set(teacherSlots.map((s) => s.teacher.toString()))];

      const conflictingTimetables = await Timetable.find({
        school: schoolId,
        isActive: true,
        class: { $ne: classId }, // skip the same class (relevant for update path)
        'schedule.periods.teacher': { $in: teacherIds },
      }).lean();

      for (const slot of teacherSlots) {
        for (const existing of conflictingTimetables) {
          for (const daySchedule of existing.schedule) {
            if (daySchedule.day !== slot.day) continue;
            for (const period of daySchedule.periods) {
              if (
                period.teacher &&
                period.teacher.toString() === slot.teacher.toString() &&
                period.startTime === slot.startTime
              ) {
                return errorResponse(
                  res,
                  `Teacher conflict detected: teacher ${slot.teacher} is already assigned at ${slot.day} ${slot.startTime} in another class.`,
                  409
                );
              }
            }
          }
        }
      }
    }

    // Deactivate any existing active timetable for this class
    await Timetable.updateMany(
      { class: classId, school: schoolId, isActive: true },
      { $set: { isActive: false } }
    );

    const timetable = await Timetable.create({
      class: classId,
      school: schoolId,
      academicYear: academicYear || undefined,
      effectiveFrom,
      effectiveTo: effectiveTo || undefined,
      isActive: true,
      schedule,
      createdBy: req.user._id,
    });

    await Activity.logActivity({
      userId: req.user._id,
      schoolId,
      type: 'OTHER',
      description: `Created timetable for class ${classId}`,
      context: 'timetable-management',
      metadata: { timetableId: timetable._id, classId },
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return successResponse(res, timetable, 'Timetable created successfully', 201);
  }),
];

// ---------------------------------------------------------------------------
// @desc    Update a timetable's periods / days
// @route   PUT /api/timetables/:id
// @access  Private (SUPER_ADMIN, SCHOOL_ADMIN)
// ---------------------------------------------------------------------------
export const updateTimetable = [
  protect,
  authorize('SUPER_ADMIN', 'SCHOOL_ADMIN'),

  body('effectiveFrom')
    .optional()
    .isISO8601().withMessage('Invalid effectiveFrom date').toDate(),
  body('effectiveTo')
    .optional()
    .isISO8601().withMessage('Invalid effectiveTo date').toDate(),
  body('academicYear')
    .optional()
    .isMongoId().withMessage('Invalid Academic Year ID'),
  body('isActive')
    .optional()
    .isBoolean().withMessage('isActive must be a boolean'),
  body('schedule')
    .optional()
    .isArray().withMessage('Schedule must be an array'),
  body('schedule.*.day')
    .optional()
    .isIn(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'])
    .withMessage('Invalid day value'),
  body('schedule.*.periods')
    .optional()
    .isArray().withMessage('Periods must be an array'),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Validation failed', 400, errors.array());
    }

    const filter = { _id: req.params.id };
    if (req.schoolId) {
      filter.school = req.schoolId;
    }

    const timetable = await Timetable.findOne(filter);
    if (!timetable) {
      return errorResponse(res, 'Timetable not found', 404);
    }

    const { effectiveFrom, effectiveTo, academicYear, isActive, schedule } = req.body;

    // Teacher conflict check when schedule is being updated
    if (schedule && schedule.length > 0) {
      const teacherSlots = [];
      for (const dayEntry of schedule) {
        for (const period of dayEntry.periods || []) {
          if (period.teacher && period.type !== 'BREAK' && period.type !== 'LUNCH') {
            teacherSlots.push({
              day: dayEntry.day,
              teacher: period.teacher,
              startTime: period.startTime,
              endTime: period.endTime,
            });
          }
        }
      }

      if (teacherSlots.length > 0) {
        const teacherIds = [...new Set(teacherSlots.map((s) => s.teacher.toString()))];

        const conflictingTimetables = await Timetable.find({
          school: timetable.school,
          isActive: true,
          _id: { $ne: timetable._id },
          'schedule.periods.teacher': { $in: teacherIds },
        }).lean();

        for (const slot of teacherSlots) {
          for (const existing of conflictingTimetables) {
            for (const daySchedule of existing.schedule) {
              if (daySchedule.day !== slot.day) continue;
              for (const period of daySchedule.periods) {
                if (
                  period.teacher &&
                  period.teacher.toString() === slot.teacher.toString() &&
                  period.startTime === slot.startTime
                ) {
                  return errorResponse(
                    res,
                    `Teacher conflict detected: teacher ${slot.teacher} is already assigned at ${slot.day} ${slot.startTime} in another class.`,
                    409
                  );
                }
              }
            }
          }
        }
      }
    }

    // If re-activating this timetable, deactivate all others for the same class
    if (isActive === true && !timetable.isActive) {
      await Timetable.updateMany(
        { class: timetable.class, school: timetable.school, _id: { $ne: timetable._id } },
        { $set: { isActive: false } }
      );
    }

    if (effectiveFrom !== undefined) timetable.effectiveFrom = effectiveFrom;
    if (effectiveTo !== undefined) timetable.effectiveTo = effectiveTo;
    if (academicYear !== undefined) timetable.academicYear = academicYear;
    if (isActive !== undefined) timetable.isActive = isActive;
    if (schedule !== undefined) timetable.schedule = schedule;

    const updated = await timetable.save();

    await Activity.logActivity({
      userId: req.user._id,
      schoolId: timetable.school,
      type: 'OTHER',
      description: `Updated timetable ${timetable._id} for class ${timetable.class}`,
      context: 'timetable-management',
      metadata: { timetableId: timetable._id, classId: timetable.class },
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return successResponse(res, updated, 'Timetable updated successfully');
  }),
];

// ---------------------------------------------------------------------------
// @desc    Delete a timetable
// @route   DELETE /api/timetables/:id
// @access  Private (SUPER_ADMIN, SCHOOL_ADMIN)
// ---------------------------------------------------------------------------
export const deleteTimetable = [
  protect,
  authorize('SUPER_ADMIN', 'SCHOOL_ADMIN'),
  asyncHandler(async (req, res) => {
    const filter = { _id: req.params.id };
    if (req.schoolId) {
      filter.school = req.schoolId;
    }

    const timetable = await Timetable.findOne(filter);
    if (!timetable) {
      return errorResponse(res, 'Timetable not found', 404);
    }

    await Timetable.deleteOne({ _id: timetable._id });

    await Activity.logActivity({
      userId: req.user._id,
      schoolId: timetable.school,
      type: 'OTHER',
      description: `Deleted timetable ${timetable._id} for class ${timetable.class}`,
      context: 'timetable-management',
      metadata: { timetableId: timetable._id, classId: timetable.class },
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return successResponse(res, null, 'Timetable deleted successfully');
  }),
];

// ---------------------------------------------------------------------------
// @desc    Get my timetable
//          - TEACHER  → returns their periods across all classes
//          - STUDENT  → returns the timetable for their enrolled class
//          - Others   → 403
// @route   GET /api/timetables/my
// @access  Private (TEACHER, STUDENT)
// ---------------------------------------------------------------------------
export const getMyTimetable = [
  protect,
  authorize('TEACHER', 'STUDENT'),
  asyncHandler(async (req, res) => {
    const { role } = req.user;

    if (role === 'TEACHER') {
      const teacher = await Teacher.findOne({ user: req.user._id }).lean();
      if (!teacher) {
        return errorResponse(res, 'Teacher profile not found', 404);
      }

      const filter = {
        isActive: true,
        'schedule.periods.teacher': teacher._id,
      };
      if (req.schoolId) {
        filter.school = req.schoolId;
      }

      const timetables = await Timetable.find(filter)
        .populate('class', 'name section')
        .populate('academicYear', 'name')
        .populate('schedule.periods.subject', 'name code')
        .populate({
          path: 'schedule.periods.teacher',
          populate: { path: 'user', select: 'firstName lastName' },
        })
        .lean();

      // Narrow each day to only the periods belonging to this teacher
      const result = timetables.map((tt) => ({
        ...tt,
        schedule: tt.schedule
          .map((day) => ({
            ...day,
            periods: day.periods.filter(
              (p) => p.teacher && p.teacher._id.toString() === teacher._id.toString()
            ),
          }))
          .filter((day) => day.periods.length > 0),
      }));

      return successResponse(res, result, 'Your timetable retrieved successfully');
    }

    if (role === 'STUDENT') {
      const student = await Student.findOne({ user: req.user._id }).lean();
      if (!student) {
        return errorResponse(res, 'Student profile not found', 404);
      }

      if (!student.class) {
        return errorResponse(res, 'Student is not enrolled in any class', 404);
      }

      const filter = { class: student.class, isActive: true };
      if (req.schoolId) {
        filter.school = req.schoolId;
      }

      const timetable = await Timetable.findOne(filter)
        .populate('class', 'name section')
        .populate('academicYear', 'name')
        .populate('schedule.periods.subject', 'name code')
        .populate({
          path: 'schedule.periods.teacher',
          populate: { path: 'user', select: 'firstName lastName' },
        })
        .lean();

      if (!timetable) {
        return errorResponse(res, 'No active timetable found for your class', 404);
      }

      return successResponse(res, timetable, 'Your timetable retrieved successfully');
    }
  }),
];

// ---------------------------------------------------------------------------
// @desc    Get timetable by ID
// @route   GET /api/timetables/:id
// @access  Private (SUPER_ADMIN, SCHOOL_ADMIN, TEACHER, STUDENT)
// ---------------------------------------------------------------------------
export const getTimetableById = [
  protect,
  authorize('SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER', 'STUDENT'),
  asyncHandler(async (req, res) => {
    const filter = { _id: req.params.id };
    if (req.schoolId) {
      filter.school = req.schoolId;
    }

    const timetable = await Timetable.findOne(filter)
      .populate('class', 'name section')
      .populate('academicYear', 'name')
      .populate('schedule.periods.subject', 'name code')
      .populate({
        path: 'schedule.periods.teacher',
        populate: { path: 'user', select: 'firstName lastName' },
      })
      .lean();

    if (!timetable) {
      return errorResponse(res, 'Timetable not found', 404);
    }

    return successResponse(res, timetable, 'Timetable retrieved successfully');
  }),
];
