import 'dotenv/config';
import mongoose from 'mongoose';

const uri = process.env.MONGO_URI || '';
mongoose
  .connect(uri)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Connection error:', err);
    process.exit(1);
  });
