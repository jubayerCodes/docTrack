import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import apiRoutes from './routes';
import { errorHandler } from './middleware/errorHandler';

/**
 * Factory function to create and configure the Express application.
 */
export const createApp = (): Application => {
  const app: Application = express();

  // CORS configuration
  const allowedOrigins = [
    process.env.CLIENT_URL || 'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
  ];

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || process.env.DEV_MODE === 'true') {
          return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    })
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // Health check endpoint
  app.get('/api/health', (req: Request, res: Response) => {
    const dbStates = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    const stateIndex = mongoose.connection.readyState;
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: {
        status: dbStates[stateIndex] || 'unknown',
        connected: stateIndex === 1,
      },
      devMode: process.env.DEV_MODE === 'true',
    });
  });

  // Mount API modules dynamically with /api/v1 prefix
  app.use('/api/v1', apiRoutes);

  // 404 handler for undefined endpoints
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      message: `Route not found: ${req.method} ${req.originalUrl}`,
    });
  });

  // Centralized error handling middleware
  app.use(errorHandler);

  return app;
};

const app = createApp();
export default app;
