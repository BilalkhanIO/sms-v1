// Assignment.js
import mongoose from "mongoose";

const { Schema, model } = mongoose;

const assignmentSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    subject: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    class: {
      type: Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    assignedBy: {
      type: Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    pointsPossible: { // Added for grading clarity
        type: Number,
        required: true,
        min: 1, // Must have at least one point possible.
    },
    submissions: [
      {
        student: {
          type: Schema.Types.ObjectId,
          ref: "Student",
          required: true,
        },
        fileUrl: {
          type: String,
          required: [true, "File URL is required for a submission"],
        },
        submittedAt: {
          type: Date,
          required: [true, "Submission date is required"], // Required for submissions
        },
        grade: {
          type: Number,
          min: 0,
        },
        feedback: {
          type: String,
          trim: true,
          required: [function() { return this.grade !== undefined; }, "Feedback is required when a grade is given."]

        },
      },
    ],
    status: {
      type: String,
      enum: ["OPEN", "CLOSED", "GRADED"],
      default: "OPEN",
    },
  },
  { timestamps: true }
);

// Virtual for calculating grade percentage
assignmentSchema.virtual('submissions.gradePercentage').get(function() {
    if (this.parent().pointsPossible && this.grade !== undefined) {
        return (this.grade / this.parent().pointsPossible) * 100;
    }
    return null;
});

// Indexing
assignmentSchema.index({ subject: 1, class: 1 });
assignmentSchema.index({ assignedBy: 1 });
assignmentSchema.index({ dueDate: 1 });
assignmentSchema.index({ status: 1 });
assignmentSchema.index({ 'submissions.student': 1 });

const Assignment = model("Assignment", assignmentSchema);
export default Assignment;