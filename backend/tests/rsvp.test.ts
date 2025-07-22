import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/index';
import { Speaker } from '../src/models/Speaker';
import { Event } from '../src/models/Event';
import { RSVP } from '../src/models/RSVP';
import jwt from 'jsonwebtoken';

jest.setTimeout(30000);

describe('RSVP Endpoints', () => {
  let token: string;
  let speakerId: string;
  let eventId: string;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI!);
    // Create a test speaker
    const speaker = await Speaker.create({
      name: 'RSVP User',
      email: 'rsvpuser@example.com',
      passwordHash: 'hashed',
    });
    speakerId = String(speaker._id);
    token = jwt.sign(
      { id: speakerId, email: speaker.email },
      process.env.JWT_SECRET!,
      { expiresIn: '1d' },
    );
    // Create a test event
    const event = await Event.create({
      title: 'RSVP Event',
      dateTime: new Date(),
      speakerIds: [speakerId],
      rsvpStatus: 'open',
    });
    eventId = String(event._id);
  });

  afterAll(async () => {
    await RSVP.deleteMany({});
    await Event.deleteMany({});
    await Speaker.deleteMany({});
    await mongoose.disconnect();
  });

  it('should submit an RSVP', async () => {
    const res = await request(app)
      .post(`/api/events/${eventId}/rsvp`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'yes' });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('yes');
  });

  it('should fetch RSVPs for an event', async () => {
    const res = await request(app)
      .get(`/api/events/${eventId}/rsvps`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].status).toBe('yes');
  });
});
