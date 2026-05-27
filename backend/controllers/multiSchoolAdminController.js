import asyncHandler from 'express-async-handler';
import School from '../models/School.js';
import User from '../models/User.js';

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
      return {
        schoolId: school._id,
        schoolName: school.name,
        studentCount,
        teacherCount,
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
