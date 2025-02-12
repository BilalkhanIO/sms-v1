import mongoose from "mongoose";

const { Schema, model } = mongoose;

const activitySchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },

    type: {
      type: String,
      enum: [
        "LOGIN",
        "LOGOUT",
        "USER_CREATED",
        "ATTENDANCE_MARKED",
        "EXAM_CREATED",
        "EXAM_SUBMITTED",
        "ASSIGNMENT_CREATED",
        "ASSIGNMENT_SUBMITTED",
        "FEE_PAID",
        "DOCUMENT_UPLOADED",
        "PROFILE_UPDATED",
        "SYSTEM",
        "OTHER",
      ],
      required: true,
      index: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    metadata: {
      type: Schema.Types.Mixed,
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

    //Custom TTL field
    expiredAT: {
      type: Date,
      default: () => Date.now() + 90 * 24 * 60 * 60 * 1000,
    },
  },
  { timestamps: true }
);

//TTL index using custom expireAT field
activitySchema.index({ expiredAT: 1 }, { expireAfterSeconds: 0 });

//Compond indexes for efficient querying
activitySchema.index({ user: 1, type: 1, createdAt: -1 });
activitySchema.index({ createdAt: -1 });

//Instance method to format activity for display
activitySchema.methods.toDisplay = function () {
  return {
    id: this._id,
    type: this.type,
    description: this.description,
    timestamp: this.createdAt,
    severity: this.severity,
    metadata: this.metadata,
  };
};

// Static method to log an activity
activitySchema.statics.logActivity = async function (data) {
  try {
    const activity = await this.create({
      user: data.userId,
      type: data.type,
      description: data.description,
      metadata: data.metadata,
      severity: data.severity,
      ip: data.ip,
      userAgent: data.userAgent,
      expiredAT: data.expiredAT,
    });
  } catch (error) {
    console.error("Activity logging failed: ", error);
    throw error;
  }
};

const Activity = model("Activity", activitySchema);
export default Activity;
