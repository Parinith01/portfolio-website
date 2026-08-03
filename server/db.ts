import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio_db', {
            serverSelectionTimeoutMS: 5000 // Fail fast if no DB
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return true;
    } catch (error) {
        console.error(`Error: ${(error as Error).message}`);
        console.warn("MongoDB Connection Failed. The app will run without database features.");
        return false;
    }
};

export default connectDB;
