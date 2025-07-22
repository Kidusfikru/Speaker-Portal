import { Router, Response } from 'express';
import { verifyToken, AuthRequest } from '../middleware/auth';
import { Event } from '../models/Event';
import { Speaker } from '../models/Speaker';
import { Registration } from '../models/Registration';
import { RSVP } from '../models/RSVP';

const router = Router();

// GET /api/dashboard/summary - numerical dashboard data
router.get('/summary', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const [
      eventCount,
      speakerCount,
      attendeeCount,
      registrationCount,
      rsvpCount,
    ] = await Promise.all([
      Event.countDocuments({}),
      Speaker.countDocuments({ role: 'speaker' }),
      Speaker.countDocuments({ role: 'attendee' }),
      Registration.countDocuments({}),
      RSVP.countDocuments({}),
    ]);

    // Top 5 events by number of attendees
    const topEvents = await Registration.aggregate([
      { $group: { _id: '$eventId', attendeeCount: { $sum: 1 } } },
      { $sort: { attendeeCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'events',
          localField: '_id',
          foreignField: '_id',
          as: 'event',
        },
      },
      { $unwind: '$event' },
      {
        $project: {
          _id: 0,
          eventId: '$_id',
          title: '$event.title',
          attendeeCount: 1,
        },
      },
    ]);

    res.json({
      eventCount,
      speakerCount,
      attendeeCount,
      registrationCount,
      rsvpCount,
      topEvents,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Failed to fetch dashboard data', error: err });
  }
});

export default router;
