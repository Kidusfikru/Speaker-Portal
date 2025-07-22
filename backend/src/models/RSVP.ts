import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IRSVP extends Document {
  speakerId: Types.ObjectId;
  eventId: Types.ObjectId;
  status: 'yes' | 'no' | 'maybe';
}

const RSVPSchema: Schema = new Schema(
  {
    speakerId: { type: Schema.Types.ObjectId, ref: 'Speaker', required: true },
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    status: { type: String, enum: ['yes', 'no', 'maybe'], required: true },
  },
  { timestamps: true },
);

RSVPSchema.index({ speakerId: 1, eventId: 1 }, { unique: true });

export const RSVP = mongoose.model<IRSVP>('RSVP', RSVPSchema);
