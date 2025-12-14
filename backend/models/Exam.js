// Exam.js
import mongoose from "mongoose";

const { Schema, model } = mongoose;

const examSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["MIDTERM", "FINAL", "QUIZ", "ASSIGNMENT", "PRACTICAL"],
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
    subject: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number, // in minutes
      required: true,
    },
    totalMarks: {
      type: Number,
      required: true,
    },
    passingMarks: {
      type: Number,
      required: true,
      validate: {
        validator: function (value) {
          return value <= this.totalMarks;
        },
        message: (props) => `Passing marks (${props.value}) cannot exceed total marks`,
      },
    },
    status: {
      type: String,
      enum: ["UPCOMING", "SCHEDULED", "ONGOING", "COMPLETED", "CANCELLED", "POSTPONED"],
      default: "UPCOMING", // More descriptive default
    },
    results: [
      {
        type: Schema.Types.ObjectId,
        ref: "Result", // Reference to the Result schema
      },
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// Indexing
examSchema.index({ class: 1, subject: 1, date: 1 });
examSchema.index({ status: 1 });

const Exam = model("Exam", examSchema);
export default Exam;