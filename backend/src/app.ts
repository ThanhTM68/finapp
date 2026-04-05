import express from 'express';
import cors from 'cors';
import { config } from './config/env';
import { routes } from './routes';
import { errorMiddleware } from './middlewares/error.middleware';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', env: config.nodeEnv, timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/v1', routes);

// Error handler (must be last)
app.use(errorMiddleware);

export { app };
