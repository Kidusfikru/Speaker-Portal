// Start scheduled jobs
import './jobs';
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { Message } from './models/Message';
import mongoose from 'mongoose';
import authRoutes from './routes/auth';
import profileRoutes from './routes/profile';
import eventsRoutes from './routes/events';
import rsvpRoutes from './routes/rsvp';
import registrationRoutes from './routes/registration';
import speakerRoutes from './routes/speaker';
import dashboardRoutes from './routes/dashboard';

const app = express();
const server = http.createServer(app);
let io: SocketIOServer | undefined;
const port = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || '';

// Enable CORS for frontend
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
);

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/api', profileRoutes);
app.use('/api', eventsRoutes);
app.use('/api', rsvpRoutes);
app.use('/api', registrationRoutes);

// Add speakers route
app.use('/api/speakers', speakerRoutes);
// Add dashboard route
app.use('/api/dashboard', dashboardRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

if (process.env.NODE_ENV !== 'test') {
  mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log('✅ Connected to MongoDB Atlas!');
      io = new SocketIOServer(server, { cors: { origin: '*' } });

      io.on('connection', (socket) => {
        socket.on('joinRoom', (eventId) => {
          socket.join(`event-${eventId}`);
        });

        socket.on('message', async (data) => {
          const { eventId, from, text } = data;
          const msg = await Message.create({
            eventId,
            from,
            text,
            timestamp: new Date(),
          });
          io!.to(`event-${eventId}`).emit('message', {
            from: msg.from,
            text: msg.text,
            timestamp: msg.timestamp,
          });
        });
      });

      server.listen(port, () => {
        console.log(`Server is running on port ${port}`);
      });
    })
    .catch((err) => {
      console.error('❌ MongoDB connection error:', err);
      process.exit(1);
    });
}

export default app;
