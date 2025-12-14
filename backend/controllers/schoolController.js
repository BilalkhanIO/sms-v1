import School from '../models/School.js';
import User from '../models/User.js';
import asyncHandler from 'express-async-handler';
import { body, validationResult } from 'express-validator';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import mongoose from 'mongoose';
import Activity from '../models/Activity.js';

// Function to generate a random password
const generateRandomPassword = () => {
  const length = 12;
  const characters =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return password;
};

// @desc    Create a new school
// @route   POST /api/schools
// @access  Private/SuperAdmin
const createSchool = [
  protect,
  authorize('SUPER_ADMIN'),
  body('name').notEmpty().withMessage('School name is required'),
  body('address').notEmpty().withMessage('Address is required'),
  body('contactInfo.phone').notEmpty().withMessage('Contact phone is required'),
  body('contactInfo.email').isEmail().withMessage('Invalid contact email address'),
  body('adminFirstName').notEmpty().withMessage('Admin first name is required'),
  body('adminLastName').notEmpty().withMessage('Admin last name is required'),
  body('adminEmail').isEmail().withMessage('Invalid admin email address'),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Validation failed', 400, errors.array());
    }

    const { name, address, contactInfo, adminFirstName, adminLastName, adminEmail } = req.body;

    // Check if school with the same name or contact email already exists
    const schoolExists = await School.findOne({
      $or: [{ name }, { 'contactInfo.email': contactInfo.email }],
    });
    if (schoolExists) {
      return errorResponse(res, 'School with this name or email already exists', 400);
    }

    // Check if an admin user with the given email already exists
    const adminUserExists = await User.findOne({ email: adminEmail });
    if (adminUserExists) {
      return errorResponse(res, 'Admin user with this email already exists', 400);
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Create a new School Admin user
      const adminUser = await User.create(
        [
          {
            firstName: adminFirstName,
            lastName: adminLastName,
            email: adminEmail,
            password: generateRandomPassword(), // Generate a random password
            role: 'SCHOOL_ADMIN',
            status: 'ACTIVE',
          },
        ],
        { session }
      );

      // Create the new school
      const school = await School.create(
        [
          {
            name,
            address,
            contactInfo,
            admin: adminUser[0]._id, // Assign the newly created admin user
            status: 'ACTIVE', // Or 'PENDING_APPROVAL' based on business logic
          },
        ],
        { session }
      );

      // Link the school to the admin user
      await User.findByIdAndUpdate(
        adminUser[0]._id,
        { school: school[0]._id },
        { session }
      );

      await session.commitTransaction();
      session.endSession(); // End session here

      // Log activity only after successful transaction commit and session end
      await Activity.logActivity({
        userId: req.user._id,
        type: 'SCHOOL_CREATED',
        description: `Created school ${school[0].name} with admin ${adminUser[0].firstName} ${adminUser[0].lastName}`,
        context: 'school-management',
        ip: req.ip,
        userAgent: req.headers['user-agent'],
      });

      return successResponse(res, school[0], 'School created successfully', 201);
    } catch (error) {
      // Abort transaction only if it hasn't been committed/ended yet
      if (session.inTransaction()) { // Check if session is still active
        await session.abortTransaction();
      }
      session.endSession();
      console.error(error);
      return errorResponse(res, 'Failed to create school', 500, error.message);
    }
  })
];

// @desc    Get all schools
// @route   GET /api/schools
// @access  Private/SuperAdmin
const getSchools = [
  protect,
  authorize('SUPER_ADMIN'),
  asyncHandler(async (req, res) => {
    const schools = await School.find().populate('admin', 'firstName lastName email');
    return successResponse(res, schools, 'Schools retrieved successfully');
  })
];

// @desc    Get school by ID
// @route   GET /api/schools/:id
// @access  Private/SuperAdmin
const getSchoolById = [
  protect,
  authorize('SUPER_ADMIN'),
  asyncHandler(async (req, res) => {
    const school = await School.findById(req.params.id).populate('admin', 'firstName lastName email');
    if (!school) {
      return errorResponse(res, 'School not found', 404);
    }
    return successResponse(res, school, 'School retrieved successfully');
  })
];

// @desc    Update school
// @route   PUT /api/schools/:id
// @access  Private/SuperAdmin
const updateSchool = [
  protect,
  authorize('SUPER_ADMIN'),
  body('name').optional().notEmpty().withMessage('School name is required'),
  body('address').optional().notEmpty().withMessage('Address is required'),
  body('contactInfo.phone').optional().notEmpty().withMessage('Contact phone is required'),
  body('contactInfo.email').optional().isEmail().withMessage('Invalid contact email address'),
  body('status').optional().isIn(['ACTIVE', 'INACTIVE', 'PENDING_APPROVAL']).withMessage('Invalid status value'),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Validation failed', 400, errors.array());
    }

    const { name, address, contactInfo, status } = req.body;
    const school = await School.findById(req.params.id);

    if (!school) {
      return errorResponse(res, 'School not found', 404);
    }

    // Check for duplicate name or email if they are being updated
    if (name && name !== school.name) {
      const nameExists = await School.findOne({ name });
      if (nameExists) {
        return errorResponse(res, 'School with this name already exists', 400);
      }
    }
    if (contactInfo?.email && contactInfo.email !== school.contactInfo.email) {
      const emailExists = await School.findOne({ 'contactInfo.email': contactInfo.email });
      if (emailExists) {
        return errorResponse(res, 'School with this contact email already exists', 400);
      }
    }

    school.name = name || school.name;
    school.address = address || school.address;
    school.contactInfo = { ...school.contactInfo, ...contactInfo };
    school.status = status || school.status;

    const updatedSchool = await school.save();

    // Log activity
    await Activity.logActivity({
      userId: req.user._id,
      type: 'SCHOOL_UPDATED',
      description: `Updated school ${updatedSchool.name}`,
      context: 'school-management',
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return successResponse(res, updatedSchool, 'School updated successfully');
  })
];

// @desc    Delete a school
// @route   DELETE /api/schools/:id
// @access  Private/SuperAdmin
const deleteSchool = [
  protect,
  authorize('SUPER_ADMIN'),
  asyncHandler(async (req, res) => {
    const school = await School.findById(req.params.id);

    if (!school) {
      return errorResponse(res, 'School not found', 404);
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Delete the associated admin user
      if (school.admin) {
        await User.deleteOne({ _id: school.admin }, { session });
      }

      await School.deleteOne({ _id: req.params.id }, { session });

      await session.commitTransaction();
      session.endSession();

      // Log activity
      await Activity.logActivity({
        userId: req.user._id,
        type: 'SCHOOL_DELETED',
        description: `Deleted school ${school.name} and its admin user`,
        context: 'school-management',
        ip: req.ip,
        userAgent: req.headers['user-agent'],
      });

      return successResponse(res, null, 'School deleted successfully');
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error(error);
      return errorResponse(res, 'Failed to delete school', 500, error.message);
    }
  })
];

export { createSchool, getSchools, getSchoolById, updateSchool, deleteSchool };