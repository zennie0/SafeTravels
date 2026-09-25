import 'dotenv/config';
import mongoose from 'mongoose';
import app from './app.js';
const port = process.env.PORT || 5000;
try {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET must be configured.');
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/safetravels');
  app.listen(port, () => console.log(`SafeTravels API listening on ${port}`));
} catch (error) { console.error('Could not start SafeTravels API:', error.message); process.exit(1); }
