// controllers/feeController.js
import Fee from '../models/Fee.js';
import asyncHandler from 'express-async-handler';
import Activity from '../models/Activity.js';
import Student from '../models/Student.js';


// @desc    Get fees by student
// @route   GET /api/fees/student/:studentId
// @access  Private
const getFeesByStudent = asyncHandler(async (req, res) => {
  const fees = await Fee.find({ student: req.params.studentId })
    .populate('student', 'admissionNumber')
    .populate('createdBy', 'firstName lastName')
    .sort('-dueDate');

  res.json(fees);
});

// @desc    Generate fee report
// @route   GET /api/fees/report
// @access  Private/Admin
const generateFeeReport = asyncHandler(async (req, res) => {
  const { startDate, endDate, status } = req.query;
  
  const filter = {};
  if (startDate && endDate) {
    filter.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }
  if (status) filter.status = status;

  const report = await Fee.aggregate([
    { $match: filter },
    {
      $group: {
        _id: '$type',
        totalAmount: { $sum: '$amount' },
        totalPaid: { $sum: '$paidAmount' },
        count: { $sum: 1 }
      }
    }
  ]);

  res.json(report);
});

// @desc    Update fee payment
// @route   PUT /api/fees/:id/pay
// @access  Private
const updateFeePayment = asyncHandler(async (req, res) => {
  const { amountPaid, paymentMethod } = req.body;
  
  const fee = await Fee.findById(req.params.id);
  
  if (!fee) {
    res.status(404);
    throw new Error('Fee record not found');
  }

  fee.paidAmount += amountPaid;
  fee.paymentMethod = paymentMethod;
  fee.paidDate = new Date();

  if (fee.paidAmount >= fee.amount) {
    fee.status = 'PAID';
  } else if (fee.paidAmount > 0) {
    fee.status = 'PARTIAL';
  }

  const updatedFee = await fee.save();

  // Log activity
  await Activity.logActivity({
    userId: req.user.id,
    type: 'FEE_PAID',
    description: `Payment of ${amountPaid} recorded for fee ${fee._id}`,
    metadata: {
      feeId: fee._id,
      studentId: fee.student
    },
    ip: req.ip,
    userAgent: req.headers['user-agent']
  });

  res.json(updatedFee);
});

export { updateFeePayment, getFeesByStudent, generateFeeReport };