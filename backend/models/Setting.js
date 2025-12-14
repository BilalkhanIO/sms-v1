import mongoose from 'mongoose';

const settingSchema = mongoose.Schema(
  {
    settingName: {
      type: String,
      required: true,
      unique: true,
    },
    settingValue: {
      type: mongoose.Schema.Types.Mixed, // Can store any type of data
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    // You might add fields for type (e.g., 'string', 'number', 'boolean', 'json')
    // or validation rules, depending on complexity.
  },
  {
    timestamps: true,
  }
);

const Setting = mongoose.model('Setting', settingSchema);

export default Setting;
