import express from 'express';
import nodemailer from 'nodemailer';
import mongoose from 'mongoose'; // Added import for mongoose
import { Contact } from '../models/contact';

const router = express.Router();

router.post('/', (req, res) => {
    const { name, email, subject = "New Portfolio Inquiry", message } = req.body;

    // 1. Respond IMMEDIATELY to the user so they don't wait
    res.status(200).json({ message: 'Message received!' });

    // 2. Process in Background (Fire and Forget)
    (async () => {
        // Log start of background task
        console.log(`Processing contact form from: ${email}`);

        // A. Try saving to DB (Timeout after 5s to avoid holding resources)
        if (mongoose.connection.readyState === 1) {
            try {
                // simple timeout race
                const savePromise = Contact.create({ name, email, subject, message });
                const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('DB Timeout')), 5000));
                await Promise.race([savePromise, timeoutPromise]);
                console.log("Saved contact to DB");
            } catch (dbError) {
                console.warn("Background DB Save failed:", dbError);
            }
        }

        // B. Try sending Email
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            try {
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS,
                    },
                });

                const mailOptions = {
                    from: process.env.EMAIL_USER, // Sender must be the authenticated user
                    to: process.env.EMAIL_USER,
                    replyTo: email, // Set Reply-To to the visitor's email
                    subject: `Portfolio Contact: ${subject}`,
                    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
                };

                await transporter.sendMail(mailOptions);
                console.log("Email sent successfully");
            } catch (emailError) {
                console.error("Background Email Send failed:", emailError);
            }
        }
    })().catch(err => console.error("Background task error:", err));
});

export default router;
