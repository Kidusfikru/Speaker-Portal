import express from 'express';
import { Speaker } from '../models/Speaker';

const router = express.Router();

// GET /api/speakers - Get list of all speaker objects (excluding passwordHash)
router.get('/', async (req, res) => {
  try {
    const speakers = await Speaker.find({ role: 'speaker' }, '-passwordHash');
    res.json(speakers);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch speakers' });
  }
});

export default router;
