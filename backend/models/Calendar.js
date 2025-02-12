import mongoose from "mongoose";

const { Schema, model } = mongoose;

const eventSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
      maxlength: [100, "Title connot exceed 100 characters"],
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
      enum: ["general", "meeting", "exam", "holiday"],
      default: "general",
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
      enum: ["public", "private", "restricted"],
      default: "public",
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
        time: Date,
        type: {
          type: String,
          enum: ["email", "notification"],
          default: "notification",
        },
        sent: {
          type: String,
          default: false,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// indexes for improved query performance
eventSchema.index({ start: 1, end: 1 });
eventSchema.index({ createdBy: 1 }), eventSchema.index({ type: 1 });
eventSchema.index({ visibility: 1 });

const Calendar = model("Calendar", eventSchema);
export default Calendar;
