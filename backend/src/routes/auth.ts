import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Speaker } from '../models/Speaker';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const SALT_ROUNDS = 10;

// Signup
router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { name, email, password, bio, photoUrl, contactInfo, role } =
      req.body;
    if (!name || !email || !password || !bio || !contactInfo || !role) {
      return res.status(400).json({
        message:
          'Name, email, password, bio, contactInfo, and role are required.',
      });
    }
    if (!['speaker', 'attendee'].includes(role)) {
      return res
        .status(400)
        .json({ message: 'Role must be speaker or attendee.' });
    }
    const existing = await Speaker.findOne({ email });
    if (existing)
      return res.status(409).json({ message: 'Email already in use' });
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const speaker = await Speaker.create({
      name,
      email,
      passwordHash,
      bio,
      photoUrl,
      contactInfo,
      role,
    });
    // Auto-login: generate JWT token
    const token = jwt.sign(
      { id: speaker._id, email: speaker.email, role: speaker.role },
      JWT_SECRET,
      { expiresIn: '1d' },
    );
    res.status(201).json({
      message: 'Signup successful',
      speaker: { id: speaker._id, name, email, role: speaker.role },
      token,
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({
      message: 'Signup failed',
      error: err instanceof Error ? err.message : err,
    });
  }
});

// Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const speaker = await Speaker.findOne({ email }).select('-passwordHash');
    if (!speaker)
      return res.status(401).json({ message: 'Invalid credentials' });
    // Need to get passwordHash for comparison
    const speakerWithHash = await Speaker.findOne({ email });
    const valid = await bcrypt.compare(password, speakerWithHash!.passwordHash);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign(
      { id: speaker._id, email: speaker.email, role: speaker.role },
      JWT_SECRET,
      { expiresIn: '1d' },
    );
    res.json({
      token,
      user: speaker,
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err });
  }
});

export default router;
