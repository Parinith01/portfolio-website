import mongoose from 'mongoose';

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  // Skip connection if no valid cloud MONGO_URI is provided in production/serverless
  if (!uri || uri.includes('localhost') || uri.includes('127.0.0.1')) {
    if (process.env.NODE_ENV === 'production') {
      console.log("No cloud MONGO_URI provided in production. Using built-in CMS JSON storage.");
      return false;
    }
  }

  const connectionUri = uri || 'mongodb://localhost:27017/portfolio_db';

  try {
    const conn = await mongoose.connect(connectionUri, {
      serverSelectionTimeoutMS: 3000 // Fast 3s timeout
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn("MongoDB Connection Failed. Running with built-in CMS JSON storage.");
    return false;
  }
};

export default connectDB;
