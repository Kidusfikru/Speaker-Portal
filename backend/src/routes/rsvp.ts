import { Router, Response } from 'express';
import { verifyToken, AuthRequest } from '../middleware/auth';
import { RSVP } from '../models/RSVP';
import { Event } from '../models/Event';

const router = Router();

// POST /api/events/:id/rsvp
router.post(
  '/events/:id/rsvp',
  verifyToken,
  async (req: AuthRequest, res: Response) => {
    try {
      const { status } = req.body;
      if (!['yes', 'no', 'maybe'].includes(status)) {
        return res.status(400).json({ message: 'Invalid RSVP status' });
      }
      const eventId = req.params.id;
      const speakerId = req.user.id;
      // Upsert RSVP
      const rsvp = await RSVP.findOneAndUpdate(
        { eventId, speakerId },
        { status },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
      res.status(200).json(rsvp);
    } catch (err) {
      res.status(500).json({ message: 'Failed to submit RSVP', error: err });
    }
  },
);

// GET /api/events/:id/rsvps
router.get(
  '/events/:id/rsvps',
  verifyToken,
  async (req: AuthRequest, res: Response) => {
    try {
      const eventId = req.params.id;
      const rsvps = await RSVP.find({ eventId }).populate(
        'speakerId',
        'name email',
      );
      res.json(rsvps);
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch RSVPs', error: err });
    }
  },
);

export default router;
