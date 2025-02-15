import mongoose from "mongoose";

const { Schema, model } = mongoose;

const teacherSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    employeeId: {
      type: String,
      required: true,
      unique: true,
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
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },
    address: {
      type: String,
    },
    contactNumber: {
      type: String,
    },
    dateOfBirth: {
      type: Date,
    },
    salary: {
      type: Number,
    },
    joiningDate: {
      type: Date,
      default: Date.now,
    },
    contactInfo: {
      address: String,
      phone: String,
      alternatePhone: String,
      emergencyContact: {
        name: String,
        relation: String,
        phone: String,
      },
    },
    documents: [
      {
        type: {
          type: String,
          required: true,
        },
        name: String,
        url: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Teacher = mongoose.models.Teacher || model("Teacher", teacherSchema);
export default Teacher;
