import cron from 'node-cron';
import { sendEmail } from '../services/emailService';
import { Event } from '../models/Event';
import { Speaker } from '../models/Speaker';
import { Registration } from '../models/Registration';

// Helper to get events in the next X hours
async function getUpcomingEvents(hours: number) {
  const now = new Date();
  const soon = new Date(now.getTime() + hours * 60 * 60 * 1000);
  return Event.find({
    dateTime: { $gte: now, $lte: soon },
  });
}

// Reminder to speakers 24h before
cron.schedule('0 * * * *', async () => {
  const events = await getUpcomingEvents(24);
  for (const event of events) {
    for (const speakerId of event.speakerIds) {
      const speaker = await Speaker.findById(speakerId);
      if (!speaker || !speaker.email) continue;
      await sendEmail({
        to: speaker.email,
        subject: `Reminder: Your event "${event.title}" is in 24 hours`,
        html: `<p>Dear ${speaker.name},<br>Your event "${event.title}" is scheduled for ${event.dateTime}.</p>`,
      });
    }
  }
});

// Reminder to attendees 12h before
cron.schedule('30 * * * *', async () => {
  const events = await getUpcomingEvents(12);
  for (const event of events) {
    const regs = await Registration.find({ eventId: event._id });
    for (const reg of regs) {
      if (!reg.email) continue;
      await sendEmail({
        to: reg.email,
        subject: `Reminder: Event "${event.title}" is in 12 hours`,
        html: `<p>Dear ${reg.name},<br>The event "${event.title}" is scheduled for ${event.dateTime}.</p>`,
      });
    }
  }
});
