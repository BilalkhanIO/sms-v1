import mongoose from 'mongoose';

const backupSchema = new mongoose.Schema(
  {
    backupName: {
      type: String,
      required: true,
      trim: true,
    },
    backupType: {
      type: String,
      required: true,
      enum: ['FULL', 'INCREMENTAL', 'DIFFERENTIAL', 'DATABASE_ONLY'],
    },
    initiatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['COMPLETED', 'FAILED', 'IN_PROGRESS'],
      default: 'IN_PROGRESS',
    },
    fileUrl: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number, // in bytes
      required: true,
    },
    duration: {
      type: Number, // in seconds
    },
    logs: [
      {
        timestamp: { type: Date, default: Date.now },
        message: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Backup = mongoose.model('Backup', backupSchema);

export default Backup;
