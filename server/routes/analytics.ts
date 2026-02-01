import express from 'express';
import mongoose from 'mongoose';
import { Analytics } from '../models/analytics';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const count = await Analytics.countDocuments();
        res.json({ totalVisitors: count });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Middleware to track visitor (to be used in index.ts)
export const trackVisitor = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // Fail fast if DB not connected
    if (mongoose.connection.readyState !== 1) {
        return next();
    }

    try {
        // Simple tracking - just path and IP hash
        await Analytics.create({
            path: req.path,
            visitorIp: req.ip // In a real app, hash this!
        });
    } catch (e) {
        // Silently fail for analytics to not block user
        console.error("Analytics Error (non-fatal)", (e as Error).message);
    }
    next();
};


export default router;
