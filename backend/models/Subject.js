import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  credits: {
    type: Number,
    required: true,
    min: 0
  },
  type: {
    type: String,
    enum: ['mandatory', 'elective'],
    default: 'mandatory'
  },
  syllabus: [{
    unit: {
      type: String,
      required: true
    },
    topics: [{
      type: String,
      required: true
    }]
  }],
  assignedTeachers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher'
  }],
  assignedClasses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
subjectSchema.index({ code: 1 }, { unique: true });
subjectSchema.index({ name: 1 });

const Subject = mongoose.model('Subject', subjectSchema);
export default Subject; 