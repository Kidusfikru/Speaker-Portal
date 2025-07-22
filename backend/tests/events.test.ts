import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/index';
import { Speaker } from '../src/models/Speaker';
import { Event } from '../src/models/Event';
import jwt from 'jsonwebtoken';

jest.setTimeout(30000);

describe('Event CRUD Endpoints', () => {
  let token: string;
  let speakerId: string;
  let eventId: string;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI!);
    // Create a test speaker
    const speaker = await Speaker.create({
      name: 'Event User',
      email: 'eventuser@example.com',
      passwordHash: 'hashed',
    });
    speakerId = String(speaker._id);
    token = jwt.sign(
      { id: speakerId, email: speaker.email },
      process.env.JWT_SECRET!,
      { expiresIn: '1d' },
    );
  });

  afterAll(async () => {
    await Event.deleteMany({});
    await Speaker.deleteMany({});
    await mongoose.disconnect();
  });

  it('should create an event', async () => {
    const res = await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Event',
        description: 'Event description',
        dateTime: new Date().toISOString(),
        speakerIds: [speakerId],
      });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Test Event');
    eventId = res.body._id;
  });

  it('should list all events for the current speaker', async () => {
    const res = await request(app)
      .get('/api/events')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should fetch one event with RSVP statuses', async () => {
    const res = await request(app)
      .get(`/api/events/${eventId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body._id).toBe(eventId);
  });

  it('should update an event', async () => {
    const res = await request(app)
      .put(`/api/events/${eventId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Updated Event' });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Updated Event');
  });

  it('should delete an event', async () => {
    const res = await request(app)
      .delete(`/api/events/${eventId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Event deleted');
  });
});
