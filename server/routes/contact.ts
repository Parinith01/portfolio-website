import express from 'express';
import nodemailer from 'nodemailer';
import mongoose from 'mongoose'; // Added import for mongoose
import { Contact } from '../models/contact';

const router = express.Router();

router.post('/', async (req, res) => {
    const { name, email, subject = "New Portfolio Inquiry", message } = req.body;

    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({ message: 'Database functionality is unavailable (MongoDB not running).' });
    }

    try {
        // 1. Save to DB
        const newContact = await Contact.create({ name, email, subject, message });

        // 2. Send Email
        const transporter = nodemailer.createTransport({
            service: 'gmail', // or configured via env
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

        // Attempt to send email, but don't crash if it fails (just log it)
        try {
            if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
                await transporter.sendMail(mailOptions);
            } else {
                console.log("Skipping email send: credentials not found");
            }
        } catch (err) {
            console.error("Email send failed:", err);
        }

        res.status(201).json({ message: 'Message sent successfully', contact: newContact });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
});

export default router;
