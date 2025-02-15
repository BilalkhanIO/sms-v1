// src/models/Class.js
import mongoose from "mongoose";

const { Schema, model } = mongoose;

const classSchema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        section: { type: String, required: true, trim: true },
        academicYear: { type: String, required: true },
        classTeacher: { type: Schema.Types.ObjectId, ref: "Teacher", required: true },
        subjects:[{
                subject: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
            }]
        ,
        students: [{ type: Schema.Types.ObjectId, ref: "Student" }],
        schedule: [
            {
                day: {
                    type: String,
                    enum: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
                    required: true,
                },
                periods: [
                    {
                        subject: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
                        teacher: { type: Schema.Types.ObjectId, ref: "Teacher", required: true },
                        startTime: String,
                        endTime: String,
                    },
                ],
            },
        ],
    },
    { timestamps: true }
);

// Compound index for class uniqueness
classSchema.index({ name: 1, section: 1, academicYear: 1 }, { unique: true });

const ClassModel = model("Class", classSchema);
export default ClassModel;
