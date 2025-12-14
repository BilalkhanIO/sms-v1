// Teacher.js
import mongoose from "mongoose";

const { Schema, model } = mongoose;

const teacherSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    school: { // New: Reference to the School model
      type: Schema.Types.ObjectId,
      ref: 'School',
      required: true,
    },
    employeeId: {
      type: String,
      required: true,
      unique: true, // Employee IDs MUST be unique
    },
    qualification: {
      type: String,
      required: true,
    },
    specialization: {
        type: String,
        required: true,
      },
      assignedClasses: [
        {
          type: Schema.Types.ObjectId,
          ref: "Class",
        },
      ],
      assignedSubjects: [
        {
          type: Schema.Types.ObjectId,
          ref: "Subject",
        },
      ],
      status: {
        type: String,
        enum: ["ACTIVE", "INACTIVE", "SUSPENDED"],
        default: "ACTIVE",
      },
      address: {
        type: String, // Could also be a structured address object like in Parent
        required: true
      },
      contactInfo: {  // More structured contact information
        phone: {
          type: String,
          required: true,
          match: [/^[0-9]{10}$/, "Please enter a valid 10-digit phone number"], // Basic phone
        },
        alternatePhone: {
          type: String,
          match: [/^[0-9]{10}$/, "Please enter a valid 10-digit phone number"], // Basic phone
        },
        emergencyContact: {
          name: { type: String, required: true },
          relation: { type: String, required: true },
          phone: {
            type: String,
            required: true,
            match: [/^[0-9]{10}$/, "Please enter a valid 10-digit phone number"], // Basic phone
          },
          _id: false, // Prevent _id for subdocuments
        },
        _id: false, // Prevent _id for subdocuments
      },
      dateOfBirth: {
        type: Date,
        required: true,
      },
      salary: {
        type: Number,
        required: true,
        min: 0,
      },
      joiningDate: {
        type: Date,
        default: Date.now,
      },
      documents: [
        {
          type: { type: String, required: true },
          name: String,
          url: { type: String, required: true },
          uploadedAt: {
            type: Date,
            default: Date.now,
          },
          _id: false, // Prevent _id for subdocuments
        },
      ],
    },
    { timestamps: true }
  );
  
  teacherSchema.index({ employeeId: 1 }, { unique: true }); // Ensure employeeId uniqueness
  teacherSchema.index({ user: 1 }, { unique: true });  // One teacher record per user
  teacherSchema.index({ 'assignedClasses': 1 });
  teacherSchema.index({ 'assignedSubjects': 1 });
  
  const Teacher = mongoose.models.Teacher || model("Teacher", teacherSchema);
  export default Teacher;