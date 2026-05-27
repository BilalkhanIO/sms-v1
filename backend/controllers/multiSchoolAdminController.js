import asyncHandler from 'express-async-handler';
import School from '../models/School.js';
import User from '../models/User.js';

import Class from '../models/Class.js';
import Fee from '../models/Fee.js';

// @desc    Get dashboard stats for multi-school admin
// @route   GET /api/multi-school-admin/dashboard-stats
// @access  Private/MULTI_SCHOOL_ADMIN
export const getDashboardStats = asyncHandler(async (req, res) => {
  const managedSchools = req.user.managedSchools;
  const stats = await Promise.all(
    managedSchools.map(async (schoolId) => {
      const school = await School.findById(schoolId);
      if (!school) return null;

      const studentCount = await User.countDocuments({ school: schoolId, role: 'STUDENT' });
      const teacherCount = await User.countDocuments({ school: schoolId, role: 'TEACHER' });
      const classCount = await Class.countDocuments({ school: schoolId });

      const feeStats = await Fee.aggregate([
        { $match: { school: schoolId, status: 'PAID' } },
        { $group: { _id: null, totalFees: { $sum: '$paidAmount' } } },
      ]);

      return {
        schoolId: school._id,
        schoolName: school.name,
        studentCount,
        teacherCount,
        classCount,
        totalFees: feeStats.length > 0 ? feeStats[0].totalFees : 0,
      };
    })
  );
  res.json(stats.filter(Boolean));
});

// @desc    Get admins for a specific school
// @route   GET /api/multi-school-admin/:schoolId/admins
// @access  Private/MULTI_SCHOOL_ADMIN
export const getSchoolAdmins = asyncHandler(async (req, res) => {
  const { schoolId } = req.params;
  if (!req.user.managedSchools.includes(schoolId)) {
    res.status(403);
    throw new Error('You are not authorized to manage this school');
  }
  const admins = await User.find({ school: schoolId, role: 'SCHOOL_ADMIN' });
  res.json(admins);
});

// @desc    Assign a school admin to a school
// @route   POST /api/multi-school-admin/:schoolId/admins
// @access  Private/MULTI_SCHOOL_ADMIN
export const assignSchoolAdmin = asyncHandler(async (req, res) => {
  const { schoolId } = req.params;
  const { email } = req.body;

  if (!req.user.managedSchools.includes(schoolId)) {
    res.status(403);
    throw new Error('You are not authorized to manage this school');
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.school = schoolId;
  user.role = 'SCHOOL_ADMIN';
  await user.save();

  res.status(201).json({ message: 'Admin assigned successfully' });
});

// @desc    Remove a school admin from a school
// @route   DELETE /api/multi-school-admin/:schoolId/admins/:adminId
// @access  Private/MULTI_SCHOOL_ADMIN
export const removeSchoolAdmin = asyncHandler(async (req, res) => {
  const { schoolId, adminId } = req.params;

  if (!req.user.managedSchools.includes(schoolId)) {
    res.status(403);
    throw new Error('You are not authorized to manage this school');
  }

  const user = await User.findById(adminId);
  if (!user || user.school.toString() !== schoolId) {
    res.status(404);
    throw new Error('Admin not found in this school');
  }

  user.school = null;
  user.role = 'USER'; // or some other default role
  await user.save();

  res.json({ message: 'Admin removed successfully' });
});

// @desc    Get all users from managed schools
// @route   GET /api/multi-school-admin/users
// @access  Private/MULTI_SCHOOL_ADMIN
export const getManagedUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ school: { $in: req.user.managedSchools } }).populate('school', 'name');
  res.json(users);
});

// @desc    Create a user in a managed school
// @route   POST /api/multi-school-admin/users
// @access  Private/MULTI_SCHOOL_ADMIN
export const createManagedUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, schoolId } = req.body;

  if (!req.user.managedSchools.includes(schoolId)) {
    res.status(403);
    throw new Error('You are not authorized to manage this school');
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
    school: schoolId,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      school: user.school,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Update a user in a managed school
// @route   PUT /api/multi-school-admin/users/:id
// @access  Private/MULTI_SCHOOL_ADMIN
export const updateManagedUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user && req.user.managedSchools.includes(user.school.toString())) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.role = req.body.role || user.role;
    if (req.body.password) {
      user.password = req.body.password;
    }
    const updatedUser = await user.save();
    res.json(updatedUser);
  } else {
    res.status(404);
    throw new Error('User not found or not in a managed school');
  }
});

// @desc    Delete a user from a managed school
// @route   DELETE /api/multi-school-admin/users/:id
// @access  Private/MULTI_SCHOOL_ADMIN
export const deleteManagedUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user && req.user.managedSchools.includes(user.school.toString())) {
    await user.deleteOne();
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found or not in a managed school');
  }
});
