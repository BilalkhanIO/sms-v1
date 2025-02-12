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
      unique: true,
      trim: true,
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
      enum: ["mandatory", "elective"],
      default: "mandatory",
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
  {
    timestamps: true,
  }
);

// Indexes for faster queries
subjectSchema.index({ name: 1 });

const Subject = model("Subject", subjectSchema);
export default Subject;
