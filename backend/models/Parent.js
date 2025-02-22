// Parent.js
import mongoose from "mongoose";

const { Schema, model } = mongoose;

const parentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // One parent record per user
    },
    children: [
      {
        type: Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
    contactNumber: {
      type: String,
      required: true,
      trim: true,
      match: [/^[0-9]{10}$/, "Please enter a valid 10-digit phone number"], // Basic phone number validation
    },
    address: { // Combined address for better structure
        street: { type: String, required: true, trim: true },
        city: { type: String, required: true, trim: true },
        state: { type: String, required: true, trim: true },
        postalCode: { type: String, required: true, trim: true },
        country: { type: String, required: true, trim: true, default: 'USA' }, // Added default country
    },
  },
  { timestamps: true }
);

parentSchema.index({ user: 1 }); // Ensure user uniqueness
parentSchema.index({ 'children': 1 });

const Parent = model("Parent", parentSchema);
export default Parent;