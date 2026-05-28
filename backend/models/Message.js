import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const messageSchema = new Schema(
  {
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    recipients: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    subject: { type: String, trim: true, maxlength: 200 },
    body: { type: String, required: true, trim: true },
    type: { type: String, enum: ['DIRECT', 'ANNOUNCEMENT', 'CIRCULAR'], default: 'DIRECT' },
    school: { type: Schema.Types.ObjectId, ref: 'School' },
    readBy: [{ user: { type: Schema.Types.ObjectId, ref: 'User' }, readAt: Date }],
    attachments: [{ name: String, url: String }],
    parentMessage: { type: Schema.Types.ObjectId, ref: 'Message' }, // for replies
  },
  { timestamps: true }
);

messageSchema.index({ sender: 1 });
messageSchema.index({ recipients: 1 });
messageSchema.index({ school: 1, type: 1 });

const Message = model('Message', messageSchema);
export default Message;
