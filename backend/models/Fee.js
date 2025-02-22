// Fee.js
import mongoose from "mongoose";

const { Schema, model } = mongoose;

const feeSchema = new Schema(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    type: {
      type: String,
      required: true,
      enum: ["TUITION", "TRANSPORT", "LIBRARY", "LABORATORY", "SPORTS", "OTHER", "ANNOUNCEMENT"],
    },
    dueDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "PAID", "OVERDUE", "PARTIAL"],
      default: "PENDING",
    },
    paymentMethod: {
      type: String,
      enum: ["CASH", "ONLINE", "CHEQUE", "BANK_TRANSFER"],
      required: function () {
        return this.status === "PAID" || this.status === "PARTIAL";
      },
    },
    paidAmount: {
      type: Number,
      default: 0,
      min: 0,
      validate: {
        validator: function (value) {
          return value <= this.amount;
        },
        message: (props) => `Paid amount (${props.value}) cannot exceed total amount`,
      },
    },
    paidDate: {
      type: Date,
      required: function () {
        return this.status === "PAID" || this.status === "PARTIAL";
      },
    },
    academicYear: {
      type: String,
      required: true,
    },
    term: { // Consider making this an enum if terms are fixed (e.g., "FALL", "SPRING", "SUMMER")
      type: String,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    transactionId: {
      type: String,
      sparse: true, // Allows multiple null values, but enforces uniqueness if a value is present
    },
    receiptNumber: {
      type: String,
      sparse: true,
    },
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
feeSchema.index({ student: 1, type: 1, academicYear: 1, term: 1 }, {unique: true}); // Prevent duplicate fee records
feeSchema.index({ status: 1 });
feeSchema.index({ dueDate: 1 });

const Fee = model("Fee", feeSchema);
export default Fee;