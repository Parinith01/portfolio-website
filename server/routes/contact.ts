import express from 'express';
import nodemailer from 'nodemailer';
import mongoose from 'mongoose';
import { Contact } from '../models/contact';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const logPath = path.resolve(process.cwd(), 'debug_mail.log');

const log = (msg: string) => {
    const time = new Date().toISOString();
    try {
        fs.appendFileSync(logPath, `[${time}] ${msg}\n`);
    } catch (e) {
        console.error("LOG ERROR:", e);
    }
};

router.post('/', (req, res) => {
    log("-----------------------------------------");
    log("ROUTE HIT: POST /api/contact");

    const { name, email, subject = "New Portfolio Inquiry", message } = req.body;
    log(`Payload: ${email} - ${subject}`);

    // 1. Respond IMMEDIATELY
    res.status(200).json({ message: 'Message received!' });

    // 2. Process in Background
    (async () => {
        // A. DB Save
        if (mongoose.connection.readyState === 1) {
            try {
                await Contact.create({ name, email, subject, message });
                log("DB: Saved successfully");
            } catch (dbError: any) {
                log(`DB Error: ${dbError.message}`);
            }
        } else {
            log("DB: Not connected");
        }

        // B. Email
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            log(`EMAIL CONFIG ERROR: User=${!!process.env.EMAIL_USER}, Pass=${!!process.env.EMAIL_PASS}`);
            return;
        }

        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS.replace(/^"|"$/g, ''),
                },
            });

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: process.env.EMAIL_USER,
                replyTo: email,
                subject: `Portfolio Contact: ${subject}`,
                text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
            };

            await transporter.sendMail(mailOptions);
            log("EMAIL SUCCESS: Sent via Nodemailer");
        } catch (emailError: any) {
            log(`EMAIL ERROR: ${emailError.message}`);
            console.error("Background Email Send failed:", emailError);
        }
    })().catch(err => {
        log(`FATAL ASYNC ERROR: ${err.message}`);
    });
});

export default router;
