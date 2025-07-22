import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description?: string;
  dateTime: Date;
  zoomLink?: string;
  speakerIds: Types.ObjectId[];
  rsvpStatus: 'open' | 'closed';
}

const EventSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    dateTime: { type: Date, required: true },
    zoomLink: { type: String },
    speakerIds: [
      { type: Schema.Types.ObjectId, ref: 'Speaker', required: true },
    ],
    rsvpStatus: { type: String, enum: ['open', 'closed'], default: 'open' },
  },
  { timestamps: true },
);

export const Event = mongoose.model<IEvent>('Event', EventSchema);
