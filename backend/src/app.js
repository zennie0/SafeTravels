import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import tripRoutes from './routes/tripRoutes.js';
import emergencyRoutes from './routes/emergencyRoutes.js';
const app = express();
// Allow a comma-separated set of exact frontend origins so production and a stable Vercel preview alias can both reach the API.
const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map(origin => origin.trim().replace(/\/+$/, ''))
  .filter(Boolean);
app.use(cors({ origin(origin, callback) {
  if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
  return callback(null, false);
} }));
app.use(express.json({ limit: '1mb' }));
app.get('/api/health', (_req, res) => res.json({ status: 'ok', app: 'SafeTravels' }));
app.use('/api/auth', authRoutes); app.use('/api/trips', tripRoutes); app.use('/api/emergencies', emergencyRoutes);
app.use((err, _req, res, _next) => { console.error(err); res.status(err.status || 500).json({ message: err.status ? err.message : 'Something went wrong.' }); });
export default app;
