// Student.js
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
      // Unique within a class
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
    parentInfo: { // All fields now optional, with guardian required
      father: {
        name: String,
        occupation: String,
        contact: {
          type: String,
          match: [/^[0-9]{10}$/, "Please enter a valid 10-digit phone number"], // Basic phone
        },
      },
      mother: {
        name: String,
        occupation: String,
        contact: {
          type: String,
          match: [/^[0-9]{10}$/, "Please enter a valid 10-digit phone number"], // Basic phone
        },
      },
      guardian: {  // MUST have a guardian
        type: Schema.Types.ObjectId,
        ref: "Parent",
        required: true,
      },
    },
    address: { // Combined address
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true, default: 'USA' }, // Added default
    },
    academicHistory: [
      {
        year: String,
        class: String,
        school: String,
        percentage: { type: Number, min: 0, max: 100 },
        _id: false, // Prevent _id for subdocuments
      },
    ],
    medicalInfo: {
      bloodGroup: String,
      allergies: [String],
      conditions: [String],
      _id: false, // Prevent _id for subdocuments
    },
    documents: [
      {
        type: { type: String, required: true },
        name: String,
        url: { type: String, required: true },
        uploadedAt: { type: Date, default: Date.now },
        _id: false, // Prevent _id for subdocuments
      },
    ],
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "GRADUATED", "TRANSFERRED", "SUSPENDED"],
      default: "ACTIVE",
    },
  },
  { timestamps: true }
);

studentSchema.index({ admissionNumber: 1 }, { unique: true }); // Admission number must be globally unique
studentSchema.index({ class: 1, rollNumber: 1 }, { unique: true }); // Roll number unique within a class
studentSchema.index({ user: 1 }, {unique: true}); // One student record per user.


const Student = model("Student", studentSchema);
export default Student;