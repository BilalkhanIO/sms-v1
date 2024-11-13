const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  type: {
    type: String,
    required: true,
    enum: ['TUITION', 'TRANSPORT', 'LIBRARY', 'LABORATORY', 'SPORTS', 'OTHER']
  },
  dueDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'PAID', 'OVERDUE', 'PARTIAL'],
    default: 'PENDING'
  },
  paymentMethod: {
    type: String,
    enum: ['CASH', 'ONLINE', 'CHEQUE', 'BANK_TRANSFER'],
    required: function() {
      return this.status === 'PAID' || this.status === 'PARTIAL';
    }
  },
  paidAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  paidDate: {
    type: Date
  },
  academicYear: {
    type: String,
    required: true
  },
  term: {
    type: String,
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  transactionId: {
    type: String,
    sparse: true
  },
  receiptNumber: {
    type: String,
    sparse: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  remarks: {
    type: String
  }
}, {
  timestamps: true
});

// Indexes
feeSchema.index({ student: 1, type: 1, academicYear: 1, term: 1 });
feeSchema.index({ status: 1 });
feeSchema.index({ dueDate: 1 });
feeSchema.index({ createdAt: 1 });

// Methods
feeSchema.methods.calculatePendingAmount = function() {
  return this.amount - this.paidAmount;
};

feeSchema.methods.isOverdue = function() {
  return this.status !== 'PAID' && this.dueDate < new Date();
};

// Statics
feeSchema.statics.getTotalCollected = async function(filters = {}) {
  const result = await this.aggregate([
    { $match: { status: 'PAID', ...filters } },
    { $group: { _id: null, total: { $sum: '$paidAmount' } } }
  ]);
  return result[0]?.total || 0;
};

feeSchema.statics.getTotalPending = async function(filters = {}) {
  const result = await this.aggregate([
    { $match: { status: { $in: ['PENDING', 'PARTIAL', 'OVERDUE'] }, ...filters } },
    { $group: { _id: null, total: { $sum: { $subtract: ['$amount', '$paidAmount'] } } } }
  ]);
  return result[0]?.total || 0;
};

// Pre-save middleware
feeSchema.pre('save', function(next) {
  if (this.paidAmount >= this.amount) {
    this.status = 'PAID';
  } else if (this.paidAmount > 0) {
    this.status = 'PARTIAL';
  } else if (this.dueDate < new Date()) {
    this.status = 'OVERDUE';
  }
  next();
});

const Fee = mongoose.model('Fee', feeSchema);
module.exports = Fee; 