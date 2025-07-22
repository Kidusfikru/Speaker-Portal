import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/index';
import { Speaker } from '../src/models/Speaker';
import { Event } from '../src/models/Event';
import { Registration } from '../src/models/Registration';
import jwt from 'jsonwebtoken';

jest.setTimeout(30000);

describe('Registration & Attendee Endpoints', () => {
  let token: string;
  let speakerId: string;
  let eventId: string;
  let registrationId: string;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI!);
    // Create a test speaker
    const speaker = await Speaker.create({
      name: 'Reg User',
      email: 'reguser@example.com',
      passwordHash: 'hashed',
      contactInfo: '123-456-7890',
    });
    speakerId = String(speaker._id);
    token = jwt.sign(
      { id: speakerId, email: speaker.email },
      process.env.JWT_SECRET!,
      { expiresIn: '1d' },
    );
    // Create a test event
    const event = await Event.create({
      title: 'Reg Event',
      dateTime: new Date(),
      speakerIds: [speakerId],
      rsvpStatus: 'open',
    });
    eventId = String(event._id);
  });

  afterAll(async () => {
    await Registration.deleteMany({});
    await Event.deleteMany({});
    await Speaker.deleteMany({});
    await mongoose.disconnect();
  });

  it('should register an attendee', async () => {
    const res = await request(app)
      .post('/api/registrations')
      .send({
        eventId,
        name: 'Attendee',
        email: 'attendee@example.com',
        contactInfo: '555-555-5555',
      });
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Attendee');
    registrationId = res.body._id;
  });

  it('should get registration by id', async () => {
    const res = await request(app)
      .get(`/api/registrations/${registrationId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body._id).toBe(registrationId);
  });

  it('should update registration', async () => {
    const res = await request(app)
      .put(`/api/registrations/${registrationId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Updated Attendee',
        email: 'attendee@example.com',
        contactInfo: '555-555-5555',
      });
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Updated Attendee');
  });

  it('should list attendees for event', async () => {
    const res = await request(app)
      .get(`/api/events/${eventId}/attendees`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].name).toBe('Updated Attendee');
  });

  it('should delete registration', async () => {
    const res = await request(app)
      .delete(`/api/registrations/${registrationId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Registration deleted');
  });
});
