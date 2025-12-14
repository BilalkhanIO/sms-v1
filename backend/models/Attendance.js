// Attendance.js
import mongoose from "mongoose";

const { Schema, model } = mongoose;

const attendanceSchema = new Schema(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    school: { // New: Reference to the School model
      type: Schema.Types.ObjectId,
      ref: 'School',
      required: true,
    },
    class: {
      type: Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["PRESENT", "ABSENT", "LATE", "EXCUSED", "SPORTS"],
      required: true,
    },
    timeIn: {
      type: Date,
      required: function() { return this.status === 'PRESENT' || this.status === 'LATE'; }
    },
    timeOut: {
      type: Date,
      required: function() { return this.status === 'PRESENT' || this.status === 'LATE'; },
      validate: {  // Ensure timeOut is after timeIn
        validator: function(value) {
          return this.timeIn ? value > this.timeIn : true;
        },
        message: 'timeOut must be after timeIn'
      }
    },
  },
  { timestamps: true }
);

// Indexing
attendanceSchema.index({ student: 1, date: 1 }, { unique: true }); // Prevent duplicate attendance records
attendanceSchema.index({ class: 1, date: 1 });
attendanceSchema.index({ date: 1, status: 1 });

const Attendance = model("Attendance", attendanceSchema);
export default Attendance;