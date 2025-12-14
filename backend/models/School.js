import mongoose from 'mongoose';

const schoolSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
      required: true,
    },
    contactInfo: {
      phone: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // Will be set after school admin user is created
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'PENDING_APPROVAL'],
      default: 'PENDING_APPROVAL',
    },
  },
  {
    timestamps: true,
  }
);

const School = mongoose.model('School', schoolSchema);

export default School;
