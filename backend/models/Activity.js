// Activity.js
import mongoose from "mongoose";

const { Schema, model } = mongoose;

const activitySchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true, // Index for user-based queries
    },
    type: {
      type: String,
      enum: [
        "LOGIN",
        "LOGOUT",
        "USER_CREATED",
        "USER_UPDATED",
        "USER_DELETED",
        "USER_STATUS_UPDATED",
        "USER_ROLE_UPDATED",
        "STUDENT_CREATED",
        "STUDENT_UPDATED",
        "STUDENT_DELETED",
        "TEACHER_CREATED",
        "TEACHER_UPDATED",
        "TEACHER_DELETED",
        "PARENT_CREATED",
        "PARENT_UPDATED",
        "PARENT_DELETED",
        "CLASS_CREATED",
        "CLASS_UPDATED",
        "CLASS_DELETED",
        "SUBJECT_CREATED",
        "SUBJECT_UPDATED",
        "SUBJECT_DELETED",
        "ATTENDANCE_MARKED",
        "EXAM_CREATED",
        "EXAM_UPDATED",
        "EXAM_DELETED",
        "EXAM_RESULT_ADDED",
        "ASSIGNMENT_CREATED",
        "ASSIGNMENT_SUBMITTED",
        "FEE_CREATED",
        "FEE_UPDATED",
        "FEE_DELETED",
        "FEE_PAID",
        "DOCUMENT_UPLOADED",
        "PROFILE_UPDATED",
        "SYSTEM",
        "OTHER",
        "EVENT_CREATED",
        "EVENT_UPDATED",
        "EVENT_DELETED",
        "SCHOOL_CREATED", // New: Added for school creation activity
      ],
      required: true,
      index: true, // Index for type-based queries
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    metadata: {
      type: Schema.Types.Mixed, // Flexible for storing various data
      default: {},
    },
    severity: {
      type: String,
      enum: ["INFO", "WARNING", "ERROR"],
      default: "INFO",
    },
    ip: {
      type: String,
      trim: true,
    },
    userAgent: {
      type: String,
      trim: true,
    },
    expiredAT: {
      type: Date,
      default: () => Date.now() + 90 * 24 * 60 * 60 * 1000, // 90 days default expiration
    },
    context: {
      // Added context for grouping related activities
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Index for automatic document expiration
activitySchema.index({ expiredAT: 1 }, { expireAfterSeconds: 0 });
// Compound index for queries involving user, type, and time
activitySchema.index({ user: 1, type: 1, createdAt: -1 });
// Index for queries based on creation time
activitySchema.index({ createdAt: -1 });
activitySchema.index({ context: 1 }); // Index on the context

activitySchema.statics.logActivity = async function (data) {
  try {
    await this.create({
      user: data.userId,
      type: data.type,
      description: data.description,
      metadata: data.metadata,
      severity: data.severity,
      ip: data.ip,
      userAgent: data.userAgent,
      expiredAT: data.expiredAT,
      context: data.context, // Store the context
    });
  } catch (error) {
    console.error("Activity logging failed: ", error);
    throw error; // Re-throw the error for proper handling
  }
};

const Activity = model("Activity", activitySchema);
export default Activity;
