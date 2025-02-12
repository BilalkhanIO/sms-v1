import mongoose from "mongoose";

const { Schema, model } = mongoose;

const studentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    admissionNumber: {
      type: String,
      required: true,
      unique: true,
    },
    class: {
      type: Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    rollNumber: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      enum: ["MALE", "FEMALE", "OTHER"],
      required: true,
    },
    parentInfo: {
      father: {
        name: String,
        occupation: String,
        contact: String,
      },
      mother: {
        name: String,
        occupation: String,
        contact: String,
      },
      guardian: {
        name: String,
        relation: String,
        contact: String,
      },
    },
    address: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
    },
    academicHistory: [
      {
        year: String,
        class: String,
        school: String,
        percentage: Number,
      },
    ],
    medicalInfo: {
      bloodGroup: String,
      allergies: [String],
      conditions: [String],
    },
    documents: [
      {
        type: String,
        name: String,
        url: String,
        uploadedAt: Date,
      },
    ],
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "GRADUATED", "TRANSFERRED"],
      default: "ACTIVE",
    },
  },
  {
    timestamps: true,
  }
);

// Index for admission number
studentSchema.index({ admissionNumber: 1 });

const Student = model("Student", studentSchema);
export default Student;
