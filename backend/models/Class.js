// Class.js
import mongoose from "mongoose";

const { Schema, model } = mongoose;

const classSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    section: { type: String, required: true, trim: true },
    academicYear: { type: String, required: true },
    school: { // New: Reference to the School model
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
    },
    classTeacher: {
      type: Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    subjects: [
      {
        type: Schema.Types.ObjectId,
        ref: "Subject",
        required: true
      },
    ],
    students: [{ type: Schema.Types.ObjectId, ref: "Student" }],
    schedule: [
      {
        day: {
          type: String,
          enum: [
            "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY",
            "SATURDAY", "SUNDAY",
          ],
          required: true,
        },
        periods: [
          {
            subject: {
              type: Schema.Types.ObjectId,
              ref: "Subject",
              required: true,
            },
            teacher: {
              type: Schema.Types.ObjectId,
              ref: "Teacher",
              required: true,
            },
            startTime: {
              type: String, // HH:mm format (24-hour)
              required: true,
              match: [/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format. Use HH:mm (24-hour).'],
            },
            endTime: {
              type: String, // HH:mm format
              required: true,
              match: [/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format. Use HH:mm (24-hour).'],
            },
            _id: false, // Prevent Mongoose from creating _id for subdocuments
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

// Unique compound index
classSchema.index({ name: 1, section: 1, academicYear: 1 }, { unique: true });
classSchema.index({ classTeacher: 1 });
classSchema.index({ 'students': 1 });

// Validate the schedule to make sure it is not created with duplicate periods
classSchema.pre('validate', function(next) {
    if (this.schedule) {
        for (const daySchedule of this.schedule) {
            const periodTimes = new Set();
            for (const period of daySchedule.periods) {
                const timeSlot = `${period.startTime}-${period.endTime}`;
                if (periodTimes.has(timeSlot)) {
                    const error = new Error(`Duplicate period found for ${daySchedule.day} at ${timeSlot}`);
                    return next(error); // Stop validation and return error
                }
                periodTimes.add(timeSlot);
            }
        }
    }
    next();
});
const ClassModel = model("Class", classSchema);
export default ClassModel;