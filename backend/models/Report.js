import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    reportName: {
      type: String,
      required: true,
      trim: true,
    },
    reportType: {
      type: String,
      required: true,
      enum: [
        'STUDENT_REPORT',
        'FINANCIAL_REPORT',
        'ATTENDANCE_REPORT',
        'EXAM_REPORT',
        'USER_ACTIVITY_REPORT',
        'SYSTEM_PERFORMANCE_REPORT',
      ],
    },
    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    generationDate: {
      type: Date,
      default: Date.now,
    },
    fileFormat: {
      type: String,
      required: true,
      enum: ['PDF', 'CSV', 'EXCEL'],
      default: 'PDF',
    },
    fileUrl: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number, // in bytes
      required: true,
    },
    status: {
      type: String,
      enum: ['COMPLETED', 'FAILED', 'IN_PROGRESS'],
      default: 'IN_PROGRESS',
    },
    filters: {
      type: Map,
      of: String,
    },
  },
  {
    timestamps: true,
  }
);

const Report = mongoose.model('Report', reportSchema);

export default Report;
