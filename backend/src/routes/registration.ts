import { Router, Response } from 'express';
import { verifyToken, AuthRequest } from '../middleware/auth';
import { Registration } from '../models/Registration';

const router = Router();

// GET /api/events/:id/attendees
router.get(
  '/events/:id/attendees',
  verifyToken,
  async (req: AuthRequest, res: Response) => {
    try {
      const attendees = await Registration.find({
        eventId: req.params.id,
      }).select('name email contactInfo');
      res.json(attendees);
    } catch (err) {
      res
        .status(500)
        .json({ message: 'Failed to fetch attendees', error: err });
    }
  },
);

// POST /api/registrations - register attendee
router.post('/registrations', async (req, res) => {
  try {
    const { eventId, name, email, contactInfo } = req.body;
    if (!eventId || !name || !email) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    try {
      const registration = await Registration.create({
        eventId,
        name,
        email,
        contactInfo,
      });
      return res.status(201).json(registration);
    } catch (err: any) {
      // Handle duplicate registration error
      if (err.code === 11000) {
        return res.status(409).json({
          message: 'You are already registered to attend this event.',
        });
      }
      throw err;
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Failed to register attendee', error: err });
  }
});

// GET /api/registrations/:id - get registration
router.get(
  '/registrations/:id',
  verifyToken,
  async (req: AuthRequest, res: Response) => {
    try {
      const registration = await Registration.findById(req.params.id);
      if (!registration)
        return res.status(404).json({ message: 'Registration not found' });
      res.json(registration);
    } catch (err) {
      res
        .status(500)
        .json({ message: 'Failed to fetch registration', error: err });
    }
  },
);

// PUT /api/registrations/:id - update registration
router.put(
  '/registrations/:id',
  verifyToken,
  async (req: AuthRequest, res: Response) => {
    try {
      const { name, email, contactInfo } = req.body;
      const registration = await Registration.findByIdAndUpdate(
        req.params.id,
        { name, email, contactInfo },
        { new: true },
      );
      if (!registration)
        return res.status(404).json({ message: 'Registration not found' });
      res.json(registration);
    } catch (err) {
      res
        .status(500)
        .json({ message: 'Failed to update registration', error: err });
    }
  },
);

// DELETE /api/registrations/:id - delete registration
router.delete(
  '/registrations/:id',
  verifyToken,
  async (req: AuthRequest, res: Response) => {
    try {
      const registration = await Registration.findByIdAndDelete(req.params.id);
      if (!registration)
        return res.status(404).json({ message: 'Registration not found' });
      res.json({ message: 'Registration deleted' });
    } catch (err) {
      res
        .status(500)
        .json({ message: 'Failed to delete registration', error: err });
    }
  },
);

export default router;
