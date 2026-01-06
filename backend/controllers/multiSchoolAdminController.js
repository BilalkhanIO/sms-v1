import asyncHandler from 'express-async-handler';
import School from '../models/School.js';
import User from '../models/User.js';
import Fee from '../models/Fee.js';
import Attendance from '../models/Attendance.js';
import mongoose from 'mongoose';

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

      // Calculate total income from fees
      const feeData = await Fee.aggregate([
        { $match: { school: new mongoose.Types.ObjectId(schoolId) } },
        { $group: { _id: null, totalIncome: { $sum: '$paidAmount' } } },
      ]);
      const totalIncome = feeData[0]?.totalIncome || 0;

      // Calculate average attendance
      const attendanceData = await Attendance.aggregate([
        { $match: { school: new mongoose.Types.ObjectId(schoolId) } },
        {
          $group: {
            _id: null,
            totalRecords: { $sum: 1 },
            presentRecords: {
              $sum: {
                $cond: [{ $eq: ['$status', 'PRESENT'] }, 1, 0],
              },
            },
          },
        },
      ]);

      const totalAttendance = attendanceData[0]?.totalRecords || 0;
      const presentAttendance = attendanceData[0]?.presentRecords || 0;
      const averageAttendance = totalAttendance > 0 ? (presentAttendance / totalAttendance) * 100 : 0;

      return {
        schoolId: school._id,
        schoolName: school.name,
        studentCount,
        teacherCount,
        totalIncome,
        averageAttendance: parseFloat(averageAttendance.toFixed(2)),
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
