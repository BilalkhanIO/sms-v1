import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const periodSchema = new Schema({
  periodNumber: { type: Number, required: true },
  startTime: { type: String, required: true }, // "08:00"
  endTime: { type: String, required: true },   // "09:00"
  subject: { type: Schema.Types.ObjectId, ref: 'Subject' },
  teacher: { type: Schema.Types.ObjectId, ref: 'Teacher' },
  room: { type: String, trim: true },
  type: { type: String, enum: ['LESSON', 'BREAK', 'LUNCH', 'FREE'], default: 'LESSON' },
});

const dayScheduleSchema = new Schema({
  day: {
    type: String,
    enum: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'],
    required: true,
  },
  periods: [periodSchema],
});

const timetableSchema = new Schema(
  {
    class: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
    academicYear: { type: Schema.Types.ObjectId, ref: 'AcademicYear' },
    school: { type: Schema.Types.ObjectId, ref: 'School', required: true },
    effectiveFrom: { type: Date, required: true },
    effectiveTo: { type: Date },
    isActive: { type: Boolean, default: true },
    schedule: [dayScheduleSchema],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

timetableSchema.index({ class: 1, isActive: 1 });
timetableSchema.index({ school: 1 });
timetableSchema.index({ teacher: 1 });

const Timetable = model('Timetable', timetableSchema);
export default Timetable;
