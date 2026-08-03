import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: false, default: 'New Portfolio Inquiry' },
    message: { type: String, required: true },
}, { timestamps: true });

export const Contact = mongoose.model('Contact', contactSchema);
