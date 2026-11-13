import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/doctrack';
  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[MongoDB] Connected to database`);
  } catch (error: any) {
    console.error(`[MongoDB] Connection error (${mongoURI}):`, error.message);
    if (process.env.DEV_MODE === 'true') {
      console.warn('⚠️ [MongoDB] Running in DEV_MODE without active database. Health check and routing stack will remain available. Configure MONGODB_URI in server/.env to enable live queries.');
    } else {
      process.exit(1);
    }
  }
};

