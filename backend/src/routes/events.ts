import { Router, Response } from 'express';
import { verifyToken, AuthRequest } from '../middleware/auth';
import { Event } from '../models/Event';
import { Speaker } from '../models/Speaker';
import { RSVP } from '../models/RSVP';
import mongoose from 'mongoose';

const router = Router();

// Stub for Zoom API integration
async function generateZoomLink() {
  // In production, call the real Zoom API here
  return 'https://zoom.us/j/1234567890';
}

// POST /api/events - create event
router.post('/events', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    // Only allow speakers to create events
    if (req.user.role !== 'speaker') {
      return res
        .status(403)
        .json({ message: 'Only speakers can create events.' });
    }
    const { title, description, dateTime, speakerIds, speakers, rsvpStatus } =
      req.body;
    // Accept either 'speakerIds' or 'speakers' as the invited speakers array
    const invited = Array.isArray(speakerIds)
      ? speakerIds
      : Array.isArray(speakers)
        ? speakers
        : [];
    if (
      !title ||
      !dateTime ||
      !Array.isArray(invited) ||
      invited.length === 0
    ) {
      return res.status(400).json({ message: 'Missing or invalid fields' });
    }
    // Use zoomLink from frontend if provided, otherwise generate one
    let zoomLink = req.body.zoomLink;
    if (!zoomLink) {
      zoomLink = await generateZoomLink();
    }
    const event = await Event.create({
      title,
      description,
      dateTime,
      zoomLink,
      speakerIds: invited.map((id: string) => new mongoose.Types.ObjectId(id)),
      rsvpStatus: rsvpStatus || 'open',
    });
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create event', error: err });
  }
});

// GET /api/events - list all events (visible to all authenticated users)
router.get('/events', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const events = await Event.find({}).populate('speakerIds', 'name email');
    // For each event, fetch RSVPs and attach to the event object
    const eventIds = events.map((e) => e._id);
    const rsvps = await RSVP.find({ eventId: { $in: eventIds } }).populate(
      'speakerId',
      'name email',
    );
    const rsvpsByEvent: Record<string, any[]> = {};
    rsvps.forEach((rsvp) => {
      const eid = rsvp.eventId.toString();
      if (!rsvpsByEvent[eid]) rsvpsByEvent[eid] = [];
      rsvpsByEvent[eid].push({
        speaker: rsvp.speakerId,
        status: rsvp.status,
      });
    });
    const eventsWithRsvps = events.map((event) => {
      const eid = String((event as any)._id);
      return {
        ...event.toObject(),
        rsvps: rsvpsByEvent[eid] || [],
      };
    });
    res.json(eventsWithRsvps);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch events', error: err });
  }
});

// GET /api/events/:id - fetch one event with RSVP statuses
router.get(
  '/events/:id',
  verifyToken,
  async (req: AuthRequest, res: Response) => {
    try {
      const event = await Event.findById(req.params.id).populate(
        'speakerIds',
        'name email',
      );
      if (!event) return res.status(404).json({ message: 'Event not found' });
      res.json(event);
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch event', error: err });
    }
  },
);

// PUT /api/events/:id - update event
router.put(
  '/events/:id',
  verifyToken,
  async (req: AuthRequest, res: Response) => {
    try {
      const { title, description, dateTime, speakerIds, rsvpStatus } = req.body;
      const update: any = { title, description, dateTime, rsvpStatus };
      if (speakerIds)
        update.speakerIds = speakerIds.map(
          (id: string) => new mongoose.Types.ObjectId(id),
        );
      const event = await Event.findByIdAndUpdate(req.params.id, update, {
        new: true,
      });
      if (!event) return res.status(404).json({ message: 'Event not found' });
      res.json(event);
    } catch (err) {
      res.status(500).json({ message: 'Failed to update event', error: err });
    }
  },
);

// DELETE /api/events/:id - remove event
router.delete(
  '/events/:id',
  verifyToken,
  async (req: AuthRequest, res: Response) => {
    try {
      const event = await Event.findByIdAndDelete(req.params.id);
      if (!event) return res.status(404).json({ message: 'Event not found' });
      res.json({ message: 'Event deleted' });
    } catch (err) {
      res.status(500).json({ message: 'Failed to delete event', error: err });
    }
  },
);

export default router;
