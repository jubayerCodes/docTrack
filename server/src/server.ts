import dotenv from 'dotenv';
import path from 'path';

// Load .env from server directory as well as cwd
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { createApp } from './app';
import { connectDB } from './config/db';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    const app = createApp();

    const server = app.listen(PORT, () => {
      console.log(`🚀 DocTrack Express Server running on port ${PORT}`);
      console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
      console.log(`⚙️ Dev Mode: ${process.env.DEV_MODE === 'true' ? 'Enabled (Auth mock)' : 'Disabled (Supabase JWT)'}`);
    });

    const shutdown = () => {
      console.log('Shutting down server gracefully...');
      server.close(() => {
        console.log('Server closed.');
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
