import Report from '../models/Report.js';
import asyncHandler from 'express-async-handler';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import PDFDocument from 'pdfkit';
import fs from 'fs';

// @desc    Generate a new report
// @route   POST /api/reports
// @access  Private/SuperAdmin
const generateReport = asyncHandler(async (req, res) => {
  const { reportName, reportType, fileFormat, filters } = req.body;

  const doc = new PDFDocument();
  const filePath = `./backend/data/reports/${reportName.replace(/ /g, '_')}_${Date.now()}.pdf`;
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  // Add content to the PDF
  doc.fontSize(25).text(reportName, {
    align: 'center',
  });

  doc.fontSize(16).text(`Report Type: ${reportType}`);
  doc.fontSize(16).text(`Generated on: ${new Date().toLocaleString()}`);
  doc.moveDown();

  doc.fontSize(12).text(JSON.stringify(filters, null, 2));

  doc.end();

  await new Promise((resolve, reject) => {
    stream.on('finish', resolve);
    stream.on('error', reject);
  });

  const stats = fs.statSync(filePath);
  const fileSizeInBytes = stats.size;

  const report = await Report.create({
    reportName,
    reportType,
    generatedBy: req.user._id,
    fileFormat,
    fileUrl: filePath,
    fileSize: fileSizeInBytes,
    status: 'COMPLETED',
    filters,
  });

  successResponse(res, report, 'Report generated successfully', 201);
});

// @desc    Get all reports
// @route   GET /api/reports
// @access  Private/SuperAdmin
const getReports = asyncHandler(async (req, res) => {
  const reports = await Report.find({}).populate('generatedBy', 'name');
  successResponse(res, reports, 'Reports retrieved successfully');
});

// @desc    Get a single report by ID
// @route   GET /api/reports/:id
// @access  Private/SuperAdmin
const getReportById = asyncHandler(async (req, res) => {
  const report = await Report.findById(req.params.id).populate(
    'generatedBy',
    'name'
  );

  if (report) {
    successResponse(res, report, 'Report retrieved successfully');
  } else {
    errorResponse(res, 'Report not found', 404);
  }
});

// @desc    Download a report
// @route   GET /api/reports/:id/download
// @access  Private/SuperAdmin
const downloadReport = asyncHandler(async (req, res) => {
  const report = await Report.findById(req.params.id);

  if (report) {
    res.download(report.fileUrl, report.reportName + '.pdf');
  } else {
    errorResponse(res, 'Report not found', 404);
  }
});

// @desc    Delete a report
// @route   DELETE /api/reports/:id
// @access  Private/SuperAdmin
const deleteReport = asyncHandler(async (req, res) => {
  const report = await Report.findById(req.params.id);

  if (report) {
    await Report.deleteOne({ _id: req.params.id });
    fs.unlink(report.fileUrl, (err) => {
      if (err) {
        console.error(err);
      }
    });
    successResponse(res, null, 'Report deleted successfully');
  } else {
    errorResponse(res, 'Report not found', 404);
  }
});

export {
  generateReport,
  getReports,
  getReportById,
  downloadReport,
  deleteReport,
};
