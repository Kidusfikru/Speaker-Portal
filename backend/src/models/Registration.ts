import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IRegistration extends Document {
  eventId: Types.ObjectId;
  name: string;
  email: string;
  contactInfo?: string;
}

const RegistrationSchema: Schema = new Schema(
  {
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    contactInfo: { type: String },
  },
  { timestamps: true },
);

RegistrationSchema.index({ eventId: 1, email: 1 }, { unique: true });

export const Registration = mongoose.model<IRegistration>(
  'Registration',
  RegistrationSchema,
);
