import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
    path: { type: String, required: true },
    visitorIp: { type: String }, // Should be hashed for privacy
    timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

export const Analytics = mongoose.model('Analytics', analyticsSchema);
