// Subject.js
import mongoose from "mongoose";

const { Schema, model } = mongoose;

const subjectSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true, // Subject codes MUST be unique
      trim: true,
    },
    school: {
      type: Schema.Types.ObjectId,
      ref: "School",
    },
    description: {
      type: String,
      trim: true,
    },
    credits: {
      type: Number,
      required: true,
      min: 0,
    },
    type: {
      type: String,
      enum: ["MANDATORY", "ELECTIVE"],
      default: "MANDATORY",
    },
    syllabus: [
      {
        unit: {
          type: String,
          required: true,
        },
        topics: [
          {
            type: String,
            required: true,
          },
        ],
        _id: false, // Prevent _id for subdocuments
      },
    ],
    assignedTeachers: [
      {
        type: Schema.Types.ObjectId,
        ref: "Teacher",
      },
    ],
    assignedClasses: [
      {
        type: Schema.Types.ObjectId,
        ref: "Class",
      },
    ],
  },
  { timestamps: true }
);

subjectSchema.index({ name: 1 });
subjectSchema.index({ code: 1 }, { unique: true }); // Ensure code uniqueness
subjectSchema.index({ 'assignedTeachers': 1 });
subjectSchema.index({ 'assignedClasses': 1 });

const Subject = model("Subject", subjectSchema);
export default Subject;