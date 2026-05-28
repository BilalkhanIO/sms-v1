import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const termSchema = new Schema({
  name: { type: String, required: true, trim: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  isActive: { type: Boolean, default: false },
});

const academicYearSchema = new Schema(
  {
    name: { type: String, required: true, trim: true }, // e.g. "2024-2025"
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    school: { type: Schema.Types.ObjectId, ref: 'School', required: true },
    isActive: { type: Boolean, default: false },
    terms: [termSchema],
  },
  { timestamps: true }
);

academicYearSchema.index({ school: 1, isActive: 1 });
academicYearSchema.index({ school: 1, name: 1 }, { unique: true });

const AcademicYear = model('AcademicYear', academicYearSchema);
export default AcademicYear;
