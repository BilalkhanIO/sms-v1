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
    experience: {
      type: Number,
      default: 0,
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
    joiningDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "ON_LEAVE"],
      default: "ACTIVE",
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
