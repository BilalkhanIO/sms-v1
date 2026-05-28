// controllers/academicYearController.js
import AcademicYear from '../models/AcademicYear.js';
import asyncHandler from 'express-async-handler';
import { body, validationResult } from 'express-validator';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import Activity from '../models/Activity.js';

// @desc    Get all academic years
// @route   GET /api/academic-years
// @access  Private (all roles)
const getAcademicYears = [
  protect,
  authorize('SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER', 'STUDENT', 'PARENT'),
  asyncHandler(async (req, res) => {
    const query = {};
    if (req.schoolId) {
      query.school = req.schoolId;
    }

    const academicYears = await AcademicYear.find(query)
      .sort({ startDate: -1 })
      .lean();

    return successResponse(res, academicYears, 'Academic years retrieved successfully');
  }),
];

// @desc    Get academic year by ID
// @route   GET /api/academic-years/:id
// @access  Private (all roles)
const getAcademicYearById = [
  protect,
  authorize('SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER', 'STUDENT', 'PARENT'),
  asyncHandler(async (req, res) => {
    const filter = { _id: req.params.id };
    if (req.schoolId) {
      filter.school = req.schoolId;
    }

    const academicYear = await AcademicYear.findOne(filter).lean();

    if (!academicYear) {
      return errorResponse(res, 'Academic year not found', 404);
    }

    return successResponse(res, academicYear, 'Academic year retrieved successfully');
  }),
];

// @desc    Create a new academic year
// @route   POST /api/academic-years
// @access  Private (SUPER_ADMIN, SCHOOL_ADMIN)
const createAcademicYear = [
  protect,
  authorize('SUPER_ADMIN', 'SCHOOL_ADMIN'),

  body('name').notEmpty().withMessage('Academic year name is required').trim(),
  body('startDate').isISO8601().withMessage('Invalid start date').toDate(),
  body('endDate').isISO8601().withMessage('Invalid end date').toDate(),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
  body('terms').optional().isArray().withMessage('Terms must be an array'),
  body('terms.*.name').notEmpty().withMessage('Term name is required'),
  body('terms.*.startDate').isISO8601().withMessage('Invalid term start date').toDate(),
  body('terms.*.endDate').isISO8601().withMessage('Invalid term end date').toDate(),
  body('terms.*.isActive').optional().isBoolean().withMessage('Term isActive must be a boolean'),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Validation failed', 400, errors.array());
    }

    const schoolId = req.schoolId;
    if (!schoolId) {
      return errorResponse(res, 'School context is required', 400);
    }

    const { name, startDate, endDate, isActive, terms } = req.body;

    // Validate date range
    if (new Date(endDate) <= new Date(startDate)) {
      return errorResponse(res, 'End date must be after start date', 400);
    }

    // Check for duplicate name within the school
    const existing = await AcademicYear.findOne({ school: schoolId, name });
    if (existing) {
      return errorResponse(res, 'An academic year with this name already exists for this school', 400);
    }

    // If new year is active, deactivate all others for this school
    if (isActive) {
      await AcademicYear.updateMany({ school: schoolId }, { $set: { isActive: false } });
    }

    const academicYear = await AcademicYear.create({
      name,
      startDate,
      endDate,
      school: schoolId,
      isActive: isActive || false,
      terms: terms || [],
    });

    await Activity.logActivity({
      userId: req.user._id,
      schoolId,
      type: 'OTHER',
      description: `Created academic year "${name}" for school ${schoolId}`,
      context: 'academic-year-management',
      metadata: { academicYearId: academicYear._id, name, isActive: academicYear.isActive },
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return successResponse(res, academicYear, 'Academic year created successfully', 201);
  }),
];

// @desc    Update an academic year (partial)
// @route   PUT /api/academic-years/:id
// @access  Private (SUPER_ADMIN, SCHOOL_ADMIN)
const updateAcademicYear = [
  protect,
  authorize('SUPER_ADMIN', 'SCHOOL_ADMIN'),

  body('name').optional().notEmpty().withMessage('Academic year name cannot be empty').trim(),
  body('startDate').optional().isISO8601().withMessage('Invalid start date').toDate(),
  body('endDate').optional().isISO8601().withMessage('Invalid end date').toDate(),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
  body('terms').optional().isArray().withMessage('Terms must be an array'),
  body('terms.*.name').optional().notEmpty().withMessage('Term name is required'),
  body('terms.*.startDate').optional().isISO8601().withMessage('Invalid term start date').toDate(),
  body('terms.*.endDate').optional().isISO8601().withMessage('Invalid term end date').toDate(),
  body('terms.*.isActive').optional().isBoolean().withMessage('Term isActive must be a boolean'),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Validation failed', 400, errors.array());
    }

    const filter = { _id: req.params.id };
    if (req.schoolId) {
      filter.school = req.schoolId;
    }

    const academicYear = await AcademicYear.findOne(filter);
    if (!academicYear) {
      return errorResponse(res, 'Academic year not found', 404);
    }

    const { name, startDate, endDate, isActive, terms } = req.body;

    // Resolve the effective start/end for validation
    const resolvedStart = startDate ? new Date(startDate) : academicYear.startDate;
    const resolvedEnd = endDate ? new Date(endDate) : academicYear.endDate;
    if (resolvedEnd <= resolvedStart) {
      return errorResponse(res, 'End date must be after start date', 400);
    }

    // Check name uniqueness if name is changing
    if (name && name !== academicYear.name) {
      const duplicate = await AcademicYear.findOne({
        school: academicYear.school,
        name,
        _id: { $ne: academicYear._id },
      });
      if (duplicate) {
        return errorResponse(res, 'An academic year with this name already exists for this school', 400);
      }
    }

    // If setting active, deactivate all others
    if (isActive === true) {
      await AcademicYear.updateMany(
        { school: academicYear.school, _id: { $ne: academicYear._id } },
        { $set: { isActive: false } }
      );
    }

    // Apply partial updates
    if (name !== undefined) academicYear.name = name;
    if (startDate !== undefined) academicYear.startDate = startDate;
    if (endDate !== undefined) academicYear.endDate = endDate;
    if (isActive !== undefined) academicYear.isActive = isActive;
    if (terms !== undefined) academicYear.terms = terms;

    const updated = await academicYear.save();

    await Activity.logActivity({
      userId: req.user._id,
      schoolId: academicYear.school,
      type: 'OTHER',
      description: `Updated academic year "${updated.name}"`,
      context: 'academic-year-management',
      metadata: { academicYearId: updated._id },
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return successResponse(res, updated, 'Academic year updated successfully');
  }),
];

// @desc    Delete an academic year (cannot delete active year)
// @route   DELETE /api/academic-years/:id
// @access  Private (SUPER_ADMIN, SCHOOL_ADMIN)
const deleteAcademicYear = [
  protect,
  authorize('SUPER_ADMIN', 'SCHOOL_ADMIN'),
  asyncHandler(async (req, res) => {
    const filter = { _id: req.params.id };
    if (req.schoolId) {
      filter.school = req.schoolId;
    }

    const academicYear = await AcademicYear.findOne(filter);
    if (!academicYear) {
      return errorResponse(res, 'Academic year not found', 404);
    }

    if (academicYear.isActive) {
      return errorResponse(res, 'Cannot delete the active academic year. Deactivate it first.', 400);
    }

    await AcademicYear.deleteOne({ _id: academicYear._id });

    await Activity.logActivity({
      userId: req.user._id,
      schoolId: academicYear.school,
      type: 'OTHER',
      description: `Deleted academic year "${academicYear.name}"`,
      context: 'academic-year-management',
      metadata: { academicYearId: academicYear._id, name: academicYear.name },
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return successResponse(res, null, 'Academic year deleted successfully');
  }),
];

// @desc    Set a specific academic year as active (deactivates all others for the school)
// @route   PATCH /api/academic-years/:id/set-active
// @access  Private (SUPER_ADMIN, SCHOOL_ADMIN)
const setActiveYear = [
  protect,
  authorize('SUPER_ADMIN', 'SCHOOL_ADMIN'),
  asyncHandler(async (req, res) => {
    const filter = { _id: req.params.id };
    if (req.schoolId) {
      filter.school = req.schoolId;
    }

    const academicYear = await AcademicYear.findOne(filter);
    if (!academicYear) {
      return errorResponse(res, 'Academic year not found', 404);
    }

    // Deactivate all other years for this school
    await AcademicYear.updateMany(
      { school: academicYear.school, _id: { $ne: academicYear._id } },
      { $set: { isActive: false } }
    );

    academicYear.isActive = true;
    const updated = await academicYear.save();

    await Activity.logActivity({
      userId: req.user._id,
      schoolId: academicYear.school,
      type: 'OTHER',
      description: `Set academic year "${updated.name}" as active`,
      context: 'academic-year-management',
      metadata: { academicYearId: updated._id, name: updated.name },
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return successResponse(res, updated, 'Academic year set as active successfully');
  }),
];

// @desc    Get the currently active term within the active academic year
// @route   GET /api/academic-years/active-term
// @access  Private (all roles)
const getActiveTerm = [
  protect,
  authorize('SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER', 'STUDENT', 'PARENT'),
  asyncHandler(async (req, res) => {
    const filter = { isActive: true };
    if (req.schoolId) {
      filter.school = req.schoolId;
    }

    const activeYear = await AcademicYear.findOne(filter).lean();
    if (!activeYear) {
      return errorResponse(res, 'No active academic year found', 404);
    }

    const activeTerm = (activeYear.terms || []).find((t) => t.isActive);
    if (!activeTerm) {
      return errorResponse(res, 'No active term found in the current academic year', 404);
    }

    return successResponse(
      res,
      { academicYear: { _id: activeYear._id, name: activeYear.name }, term: activeTerm },
      'Active term retrieved successfully'
    );
  }),
];

export {
  getAcademicYears,
  getAcademicYearById,
  createAcademicYear,
  updateAcademicYear,
  deleteAcademicYear,
  setActiveYear,
  getActiveTerm,
};
