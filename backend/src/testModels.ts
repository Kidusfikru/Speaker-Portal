import 'dotenv/config';
import mongoose from 'mongoose';
import { Speaker } from './models/Speaker';
import { Event } from './models/Event';

const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://localhost:27017/speaker_test';

async function main() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  // Clean up test data
  await Speaker.deleteMany({});
  await Event.deleteMany({});

  // Create a Speaker
  const speaker = await Speaker.create({
    name: 'Test Speaker',
    email: 'test@example.com',
    passwordHash: 'hashedpassword',
    bio: 'A test speaker',
    photoUrl: 'http://example.com/photo.jpg',
    contactInfo: '123-456-7890',
  });
  console.log('Speaker created:', speaker);

  // Create an Event
  const event = await Event.create({
    title: 'Test Event',
    description: 'A test event',
    dateTime: new Date(),
    zoomLink: 'https://zoom.us/test',
    speakerIds: [speaker._id],
    rsvpStatus: 'open',
  });
  console.log('Event created:', event);

  // Fetch and print
  const speakers = await Speaker.find();
  const events = await Event.find().populate('speakerIds');
  console.log('All Speakers:', speakers);
  console.log('All Events:', events);

  await mongoose.disconnect();
  console.log('Disconnected from MongoDB');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
