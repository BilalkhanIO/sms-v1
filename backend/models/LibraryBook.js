import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const issueSchema = new Schema({
  borrower: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  borrowerType: { type: String, enum: ['STUDENT', 'TEACHER', 'STAFF'] },
  issuedDate: { type: Date, required: true, default: Date.now },
  dueDate: { type: Date, required: true },
  returnDate: { type: Date },
  fine: { type: Number, default: 0 },
  status: { type: String, enum: ['ISSUED', 'RETURNED', 'OVERDUE', 'LOST'], default: 'ISSUED' },
});

const libraryBookSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    isbn: { type: String, trim: true },
    category: { type: String, trim: true },
    publisher: { type: String, trim: true },
    publishYear: { type: Number },
    totalCopies: { type: Number, required: true, default: 1, min: 1 },
    availableCopies: { type: Number, required: true, default: 1, min: 0 },
    location: { type: String, trim: true }, // shelf/rack
    school: { type: Schema.Types.ObjectId, ref: 'School', required: true },
    coverImage: { type: String },
    description: { type: String, trim: true },
    issues: [issueSchema],
    status: { type: String, enum: ['AVAILABLE', 'OUT_OF_STOCK', 'DISCONTINUED'], default: 'AVAILABLE' },
  },
  { timestamps: true }
);

libraryBookSchema.index({ school: 1 });
libraryBookSchema.index({ isbn: 1 });
libraryBookSchema.index({ title: 'text', author: 'text' });

const LibraryBook = model('LibraryBook', libraryBookSchema);
export default LibraryBook;
