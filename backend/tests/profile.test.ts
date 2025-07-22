jest.setTimeout(30000); // 30 seconds
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/index';
import { Speaker } from '../src/models/Speaker';
import jwt from 'jsonwebtoken';

describe('Profile Management API', () => {
  let token: string;
  let speakerId: string;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI!);
    // Create a test speaker
    const speaker = await Speaker.create({
      name: 'Test User',
      email: 'testuser@example.com',
      passwordHash: 'hashed',
      bio: 'Test bio',
      contactInfo: '123-456-7890',
    });
    speakerId = String(speaker._id);
    token = jwt.sign(
      { id: speakerId, email: speaker.email },
      process.env.JWT_SECRET!,
      { expiresIn: '1d' },
    );
  });

  afterAll(async () => {
    await Speaker.deleteMany({});
    await mongoose.disconnect();
  });

  it('should get current user profile', async () => {
    const res = await request(app)
      .get('/api/speakers/me')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.email).toBe('testuser@example.com');
  });

  // Add more tests for PUT /api/speakers/me as needed
});
