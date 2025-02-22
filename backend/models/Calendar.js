// Calendar.js
import mongoose from "mongoose";

const { Schema, model } = mongoose;

const eventSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    start: {
      type: Date,
      required: [true, "Start date is required"],
    },
    end: {
      type: Date,
      required: [true, "End date is required"],
      validate: {
        validator: function (value) {
          return value >= this.start;
        },
        message: "End date must be after or equal to start date",
      },
    },
    type: {
      type: String,
      enum: ["GENERAL", "MEETING", "EXAM", "HOLIDAY", "SPORTS"],
      default: "GENERAL",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    visibility: {
      type: String,
      enum: ["PUBLIC", "PRIVATE", "RESTRICTED"],
      default: "PUBLIC",
    },
    location: {
      type: String,
      trim: true,
    },
    color: {
      type: String,
      default: "#3B82F6",
    },
    reminders: [
      {
        time: {
          type: Date,
          required: [true, 'Reminder time is required'],
          validate: {
            validator: function(value) {
              return value < this.parent().start;
            },
            message: 'Reminder time must be before the event start time'
          }
        },
        type: {
          type: String,
          enum: ["EMAIL", "NOTIFICATION", "SMS"],
          default: "NOTIFICATION",
        },
        sent: {
          type: Boolean,
          default: false,
        },
      },
    ],
    recurrence: { // Simplified recurrence handling
      type: String,
      enum: [null, "DAILY", "WEEKLY", "MONTHLY", "YEARLY"], // null means no recurrence
      default: null,
    },
  },
  { timestamps: true }
);

// Indexing
eventSchema.index({ start: 1, end: 1 });
eventSchema.index({ createdBy: 1 });
eventSchema.index({ type: 1 });
eventSchema.index({ visibility: 1 });

// Virtual property to check if an event is recurring
eventSchema.virtual('isRecurring').get(function() {
    return this.recurrence !== null;
});

const Event = model("Event", eventSchema);
export default Event;