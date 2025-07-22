import { Router, Response } from 'express';
import { verifyToken, AuthRequest } from '../middleware/auth';
import { Speaker } from '../models/Speaker';
import AWS from 'aws-sdk';
import multer from 'multer';

const router = Router();

// AWS S3 config
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const upload = multer({ storage: multer.memoryStorage() });

// GET /api/speakers/me
router.get(
  '/speakers/me',
  verifyToken,
  async (req: AuthRequest, res: Response) => {
    try {
      const speaker = await Speaker.findById(req.user.id).select(
        '-passwordHash',
      );
      if (!speaker)
        return res.status(404).json({ message: 'Speaker not found' });
      res.json(speaker);
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch profile', error: err });
    }
  },
);

// PUT /api/speakers/me
router.put(
  '/speakers/me',
  verifyToken,
  upload.single('photo'),
  async (req: AuthRequest, res: Response) => {
    try {
      const { name, bio, contactInfo, email } = req.body;
      let photoUrl;
      if (req.file) {
        const params = {
          Bucket: process.env.AWS_S3_BUCKET_NAME!,
          Key: `photos/${req.user.id}_${Date.now()}`,
          Body: req.file.buffer,
          ContentType: req.file.mimetype,
          ACL: 'public-read',
        };
        const uploadResult = await s3.upload(params).promise();
        photoUrl = uploadResult.Location;
      }
      const update: any = { name, bio, contactInfo };
      if (email) update.email = email;
      if (photoUrl) update.photoUrl = photoUrl;
      const speaker = await Speaker.findByIdAndUpdate(req.user.id, update, {
        new: true,
        select: '-passwordHash',
      });
      if (!speaker)
        return res.status(404).json({ message: 'Speaker not found' });
      res.json(speaker);
    } catch (err) {
      res.status(500).json({ message: 'Failed to update profile', error: err });
    }
  },
);

export default router;
