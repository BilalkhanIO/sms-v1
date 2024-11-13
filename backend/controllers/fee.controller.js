const Fee = require('../models/Fee');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Get fee statistics
exports.getFeeStats = catchAsync(async (req, res) => {
  const stats = {
    totalCollection: 1235000,
    totalOutstanding: 235000,
    defaulterCount: 45,
    collectionRate: 85,
    collectionTrend: [
      { month: 'Jan', amount: 100000, target: 120000 },
      { month: 'Feb', amount: 115000, target: 120000 },
      { month: 'Mar', amount: 130000, target: 120000 },
      { month: 'Apr', amount: 125000, target: 120000 },
      { month: 'May', amount: 140000, target: 120000 },
      { month: 'Jun', amount: 135000, target: 120000 }
    ],
    feeTypeDistribution: [
      { name: 'Tuition', value: 70 },
      { name: 'Transport', value: 15 },
      { name: 'Library', value: 10 },
      { name: 'Other', value: 5 }
    ],
    classWiseCollection: [
      { class: 'X-A', collected: 150000, pending: 20000 },
      { class: 'X-B', collected: 145000, pending: 25000 },
      { class: 'IX-A', collected: 140000, pending: 30000 },
      { class: 'IX-B', collected: 135000, pending: 35000 }
    ],
    paymentMethodDistribution: [
      { name: 'Online', value: 60 },
      { name: 'Cash', value: 25 },
      { name: 'Cheque', value: 15 }
    ]
  };

  res.status(200).json(stats);
});

// Get fee structure
exports.getFeeStructure = catchAsync(async (req, res) => {
  const feeStructure = {
    academicYear: '2023-24',
    classes: [
      {
        class: 'X',
        sections: ['A', 'B'],
        fees: [
          { type: 'Tuition', amount: 50000, frequency: 'MONTHLY' },
          { type: 'Transport', amount: 5000, frequency: 'MONTHLY' },
          { type: 'Library', amount: 2000, frequency: 'YEARLY' }
        ]
      }
    ]
  };

  res.status(200).json(feeStructure);
});

// Get defaulters
exports.getDefaulters = catchAsync(async (req, res) => {
  const defaulters = [
    {
      studentId: '1',
      name: 'John Doe',
      class: 'X-A',
      pendingAmount: 15000,
      lastPaymentDate: '2024-01-15',
      pendingMonths: 2
    }
  ];

  res.status(200).json(defaulters);
});

// Get reports
exports.getReports = catchAsync(async (req, res) => {
  const reports = {
    summary: {
      totalCollected: 1235000,
      totalPending: 235000,
      collectionRate: '85%'
    },
    details: [
      {
        date: '2024-02-15',
        amount: 15000,
        type: 'Tuition',
        student: 'John Doe',
        status: 'Paid'
      }
    ]
  };

  res.status(200).json(reports);
});

// Collect fee
exports.collectFee = catchAsync(async (req, res) => {
  const { studentId, amount, feeType, paymentMethod } = req.body;

  if (!studentId || !amount || !feeType || !paymentMethod) {
    throw new AppError('Missing required fields', 400);
  }

  const feeCollection = {
    id: Date.now(),
    studentId,
    amount,
    feeType,
    paymentMethod,
    status: 'SUCCESS',
    transactionDate: new Date(),
    receiptNumber: `RCPT-${Date.now()}`
  };

  res.status(201).json(feeCollection);
}); 