import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const leaveRequestSchema = new Schema(
  {
    applicant: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    applicantType: { type: String, enum: ['TEACHER', 'STUDENT', 'STAFF'], required: true },
    leaveType: {
      type: String,
      enum: ['SICK', 'CASUAL', 'MATERNITY', 'PATERNITY', 'EMERGENCY', 'UNPAID', 'OTHER'],
      required: true,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    totalDays: { type: Number },
    reason: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'],
      default: 'PENDING',
    },
    reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: { type: Date },
    reviewNotes: { type: String, trim: true },
    school: { type: Schema.Types.ObjectId, ref: 'School', required: true },
    attachmentUrl: { type: String },
  },
  { timestamps: true }
);

leaveRequestSchema.pre('save', function (next) {
  if (this.startDate && this.endDate) {
    const ms = this.endDate - this.startDate;
    this.totalDays = Math.ceil(ms / (1000 * 60 * 60 * 24)) + 1;
  }
  next();
});

leaveRequestSchema.index({ applicant: 1, status: 1 });
leaveRequestSchema.index({ school: 1, status: 1 });
leaveRequestSchema.index({ startDate: 1, endDate: 1 });

const LeaveRequest = model('LeaveRequest', leaveRequestSchema);
export default LeaveRequest;
