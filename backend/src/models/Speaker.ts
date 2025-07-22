import mongoose, { Document, Schema } from 'mongoose';

export interface ISpeaker extends Document {
  name: string;
  email: string;
  passwordHash: string;
  bio: string;
  photoUrl?: string;
  contactInfo: string;
  role: 'speaker' | 'attendee';
}

const SpeakerSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    bio: { type: String, required: true },
    photoUrl: { type: String },
    contactInfo: { type: String, required: true },
    role: {
      type: String,
      enum: ['speaker', 'attendee'],
      default: 'speaker',
      required: true,
    },
  },
  { timestamps: true },
);

export const Speaker = mongoose.model<ISpeaker>('Speaker', SpeakerSchema);
