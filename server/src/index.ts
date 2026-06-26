import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/auth.js';
import testsRouter from './routes/tests.js';
import leaderboardRouter from './routes/leaderboard.js';
import certificatesRouter from './routes/certificates.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend Vite dev server (usually localhost:5173) and any other domains
app.use(cors({
  origin: '*', // For development, allow all. In production we'd limit this.
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id']
}));

app.use(express.json());

// Request logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Register API Routes
app.use('/api/auth', authRouter);
app.use('/api/tests', testsRouter);
app.use('/api/leaderboard', leaderboardRouter);
app.use('/api/certificates', certificatesRouter);

// Health check endpoint
app.get('/api', (req, res) => {
  res.json({ message: 'TypeSprint API is running smoothly!', version: '1.0.0' });
});

// Centralized error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: 'Internal server error occurred' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`TypeSprint Backend running on http://localhost:${PORT}`);
});
