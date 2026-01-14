import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      default: null,
    },
    action: {
      type: String,
      required: true,
      enum: [
        'LOGIN',
        'LOGOUT',
        'USER_CREATE',
        'USER_UPDATE',
        'USER_DELETE',
        'SCHOOL_CREATE',
        'SCHOOL_UPDATE',
        'SCHOOL_DELETE',
        'SYSTEM_SETTINGS_UPDATE',
        'BACKUP_CREATE',
        'REPORT_GENERATE',
        // Add other relevant actions as needed
      ],
    },
    entity: {
      type: String,
      required: true,
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    status: {
      type: String,
      enum: ['SUCCESS', 'FAILURE'],
      required: true,
    },
    details: {
      type: String,
    },
    ipAddress: {
      type: String,
    },
    before: {
      type: mongoose.Schema.Types.Mixed,
    },
    after: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

export default AuditLog;
