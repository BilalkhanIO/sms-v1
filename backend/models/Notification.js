// Notification.js
import mongoose from "mongoose";

const { Schema, model } = mongoose;

const notificationSchema = new Schema(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["INFO", "WARNING", "ALERT", "ANNOUNCEMENT"],
      default: "INFO",
    },
    read: {
      type: Boolean,
      default: false,
    },
    readAt: { // Track when the notification was read
        type: Date,
        default: null, // Will be set when 'read' becomes true
    },
    link: String, // Optional link for more details
  },
  { timestamps: true }
);

// Compound index for efficient querying
notificationSchema.index({ recipient: 1, read: 1 });
notificationSchema.index({ type: 1 }); // Index on the notification type
notificationSchema.index({ read: 1 }); // Index on read status

const Notification = model("Notification", notificationSchema);
export default Notification;