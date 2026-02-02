import express from 'express';
import nodemailer from 'nodemailer';
import mongoose from 'mongoose'; // Added import for mongoose
import { Contact } from '../models/contact';

const router = express.Router();

router.post('/', async (req, res) => {
    const { name, email, subject = "New Portfolio Inquiry", message } = req.body;

    // Database is optional for the user experience now
    let newContact = null;
    if (mongoose.connection.readyState === 1) {
        try {
            newContact = await Contact.create({ name, email, subject, message });
        } catch (dbError) {
            console.warn("Failed to save to database:", dbError);
        }
    } else {
        console.warn("Database not ready, skipping save.");
    }

    try {
        // 2. Send Email
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });

            const mailOptions = {
                from: email,
                to: process.env.EMAIL_USER,
                subject: `Portfolio Contact: ${subject}`,
                text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
            };

            await transporter.sendMail(mailOptions);
        } else {
            console.log("Skipping email send: credentials not found");
        }
    } catch (err) {
        console.error("Email send failed:", err);
    }

    // Always succeed from the user's perspective
    res.status(200).json({ message: 'Message received!', contact: newContact });
});

export default router;
