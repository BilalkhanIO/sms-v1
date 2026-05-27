import asyncHandler from 'express-async-handler';
import { successResponse } from '../utils/apiResponse.js';
import { Parser } from 'json2csv';
import Student from '../models/Student.js';

// @desc    Get all report types
// @route   GET /api/reports/types
// @access  Private/SuperAdmin
export const getReportTypes = asyncHandler(async (req, res) => {
  const reportTypes = [
    {
      id: 'student-report',
      name: 'Student Report',
      description: 'Comprehensive student information and academic performance',
      category: 'Academic'
    }
  ];
  successResponse(res, reportTypes, 'Report types retrieved successfully');
});

// @desc    Generate a report
// @route   POST /api/reports/generate/:reportType
// @access  Private/SuperAdmin
export const generateReport = asyncHandler(async (req, res) => {
  const { reportType } = req.params;
  const { filters } = req.body;

  if (reportType === 'student-report') {
    let query = {};

    if (filters) {
      if (filters.class) {
        query.class = filters.class;
      }
      if (filters.start && filters.end) {
        query.createdAt = { $gte: new Date(filters.start), $lte: new Date(filters.end) };
      }
    }

    const students = await Student.find(query).populate('user', 'firstName lastName email');
    const fields = ['user.firstName', 'user.lastName', 'user.email', 'admissionNumber', 'rollNumber', 'gender'];
    const json2csv = new Parser({ fields });
    const csv = json2csv.parse(students);
    res.header('Content-Type', 'text/csv');
    res.attachment('student-report.csv');
    return res.send(csv);
  } else {
    res.status(400);
    throw new Error('Invalid report type');
  }
});
