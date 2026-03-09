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

// @desc    Get all school admins for the managed schools
// @route   GET /api/multi-school-admin/admins
// @access  Private/MULTI_SCHOOL_ADMIN
export const getAllSchoolAdmins = asyncHandler(async (req, res) => {
  const managedSchools = req.user.managedSchools;
  const admins = await User.find({
    school: { $in: managedSchools },
    role: 'SCHOOL_ADMIN',
  }).populate('school', 'name');
  res.json({ admins });
});

// @desc    Get detailed statistics for a specific school
// @route   GET /api/multi-school-admin/schools/:schoolId/details
// @access  Private/MULTI_SCHOOL_ADMIN
export const getSchoolDetails = asyncHandler(async (req, res) => {
  const { schoolId } = req.params;

  if (!req.user.managedSchools.includes(schoolId)) {
    res.status(403);
    throw new Error('You are not authorized to view this school');
  }

  const school = await School.findById(schoolId);
  if (!school) {
    res.status(404);
    throw new Error('School not found');
  }

  // Overview
  const totalStudents = await User.countDocuments({ school: schoolId, role: 'STUDENT' });
  const totalTeachers = await User.countDocuments({ school: schoolId, role: 'TEACHER' });
  const totalClasses = school.classes.length;

  // Student Demographics
  const studentDemographics = await User.aggregate([
    { $match: { school: school._id, role: 'STUDENT' } },
    { $group: { _id: '$gradeLevel', value: { $sum: 1 } } },
    { $project: { name: '$_id', value: 1, _id: 0 } },
    { $sort: { name: 1 } },
  ]);

  // Financial Summary (simplified)
  const revenue = totalStudents * 5000; // Assuming $5000 per student
  const expenses = totalTeachers * 60000; // Assuming $60000 per teacher
  const financialSummary = {
    revenue,
    expenses,
  };

  res.json({
    school: { id: school._id, name: school.name },
    overview: {
      totalStudents,
      totalTeachers,
      totalClasses,
    },
    studentDemographics,
    financialSummary,
  });
});

// @desc    Create a new school admin
// @route   POST /api/multi-school-admin/admins
// @access  Private/MULTI_SCHOOL_ADMIN
export const createSchoolAdmin = asyncHandler(async (req, res) => {
  const { name, email, password, schoolId } = req.body;

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
    school: schoolId,
    role: 'SCHOOL_ADMIN',
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

// @desc    Update a school admin
// @route   PUT /api/multi-school-admin/admins/:adminId
// @access  Private/MULTI_SCHOOL_ADMIN
export const updateSchoolAdmin = asyncHandler(async (req, res) => {
  const { adminId } = req.params;
  const { name, email, password, schoolId } = req.body;

  const user = await User.findById(adminId);

  if (!user || user.role !== 'SCHOOL_ADMIN') {
    res.status(404);
    throw new Error('School admin not found');
  }

  if (!req.user.managedSchools.includes(user.school.toString())) {
    res.status(403);
    throw new Error('You are not authorized to manage this admin');
  }

  user.name = name || user.name;
  user.email = email || user.email;
  user.school = schoolId || user.school;
  if (password) {
    user.password = password;
  }

  const updatedUser = await user.save();
  res.json(updatedUser);
});

// @desc    Delete a school admin
// @route   DELETE /api/multi-school-admin/admins/:adminId
// @access  Private/MULTI_SCHOOL_ADMIN
export const deleteSchoolAdmin = asyncHandler(async (req, res) => {
  const { adminId } = req.params;
  const user = await User.findById(adminId);

  if (!user || user.role !== 'SCHOOL_ADMIN') {
    res.status(404);
    throw new Error('School admin not found');
  }

  if (!req.user.managedSchools.includes(user.school.toString())) {
    res.status(403);
    throw new Error('You are not authorized to manage this admin');
  }

  await User.deleteOne({ _id: adminId });
  res.json({ message: 'School admin removed' });
});
