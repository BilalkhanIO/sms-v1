// Result.js  -- NEW FILE!
import mongoose from "mongoose";

const { Schema, model } = mongoose;

const resultSchema = new Schema({
    student: {
        type: Schema.Types.ObjectId,
        ref: "Student",
        required: true,
    },
    exam: { // Add reference to Exam here
        type: Schema.Types.ObjectId,
        ref: "Exam",
        required: true,
    },
    marksObtained: {
        type: Number,
        required: true,
        min: 0,
        validate: {
          validator: async function (value) {
            const exam = await mongoose.model('Exam').findById(this.exam); // Correctly fetch totalMarks
            if (!exam) {
                return false; // Or throw an error, depending on your needs
            }
            return value <= exam.totalMarks;
          },
          message: (props) => `Marks (${props.value}) cannot exceed total marks.`,
        },
    },
    grade: String,
    remarks: String,
}, { timestamps: true });

// Add a compound unique index to ensure one result per student per exam.
resultSchema.index({ student: 1, exam: 1 }, { unique: true });
resultSchema.index({ exam: 1 }); // Index for querying results by exam
resultSchema.index({ student: 1 });// Index for querying results by student

const Result = model("Result", resultSchema);
export default Result;