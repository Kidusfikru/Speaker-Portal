import mongoose from 'mongoose';
import { Server } from 'http';
import { AddressInfo } from 'net';
import Client from 'socket.io-client';
// import type { Socket as SocketType } from 'socket.io-client';
import { Message } from '../src/models/Message';
import { Event } from '../src/models/Event';
import { Speaker } from '../src/models/Speaker';
import app from '../src/index';

jest.setTimeout(20000);

describe('Socket.IO Chat', () => {
  let server: Server;
  let address: AddressInfo;
  let clientSocket: any;
  let eventId: mongoose.Types.ObjectId;
  let speakerId: mongoose.Types.ObjectId;

  beforeAll(async () => {
    // Start the server
    server = app.listen(0);
    address = server.address() as AddressInfo;
    // Connect to test DB
    await mongoose.connect(process.env.MONGO_URI || '', { dbName: 'testdb' });
    // Create a test event and speaker
    const speaker = await Speaker.create({
      name: 'Test Speaker',
      email: 'test@speaker.com',
      passwordHash: 'hashed', // <-- Fix here
    });
    speakerId = speaker._id as mongoose.Types.ObjectId;
    const event = await Event.create({
      title: 'Test Event',
      description: 'desc',
      dateTime: new Date(), // <-- CORRECT
      speaker: speakerId,
    });
    eventId = event._id as mongoose.Types.ObjectId;
    // Connect client
    clientSocket = Client(`http://localhost:${address.port}`);
  });

  afterAll(async () => {
    if (clientSocket) clientSocket.close(); // <-- Fix here
    await Message.deleteMany({});
    await Event.deleteMany({});
    await Speaker.deleteMany({});
    await mongoose.connection.close();
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });

  it('should send and persist a chat message', (done) => {
    const testMsg = {
      eventId: eventId.toString(),
      from: 'TestUser',
      text: 'Hello world!',
    };
    clientSocket.emit('joinRoom', eventId.toString());
    clientSocket.emit('chatMessage', testMsg);
    clientSocket.on('message', async (msg: any) => {
      expect(msg.text).toBe('Hello world!');
      expect(msg.from).toBe('TestUser');
      // Check DB
      const dbMsg = await Message.findOne({ eventId, text: 'Hello world!' });
      expect(dbMsg).not.toBeNull();
      expect(dbMsg!.from).toBe('TestUser');
      done();
    });
  });
});
