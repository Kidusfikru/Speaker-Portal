import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IMessage extends Document {
  eventId: Types.ObjectId;
  from: string;
  text: string;
  timestamp: Date;
}

const MessageSchema: Schema = new Schema(
  {
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    from: { type: String, required: true },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export const Message = mongoose.model<IMessage>('Message', MessageSchema);
