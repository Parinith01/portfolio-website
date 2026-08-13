import express from 'express';
import nodemailer from 'nodemailer';
import mongoose from 'mongoose';
import { Contact } from '../models/contact';
import { cmsStorage } from '../storageCMS';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const logPath = path.resolve(process.cwd(), 'debug_mail.log');

const log = (msg: string) => {
    const time = new Date().toISOString();
    console.log(`[${time}] ${msg}`);
    try {
        if (!process.env.VERCEL && process.env.NODE_ENV !== 'production') {
            fs.appendFileSync(logPath, `[${time}] ${msg}\n`);
        }
    } catch (e) {
        // Silently catch read-only filesystem logging errors on Vercel
    }
};

router.post('/', (req, res) => {
    log("-----------------------------------------");
    log("ROUTE HIT: POST /api/contact");

    const { name, email, subject = "New Portfolio Inquiry", message } = req.body;
    log(`Payload: ${email} - ${subject}`);

    // Save to CMS storage for Admin Inbox
    try {
        cmsStorage.addMessage({ name, email, message: message || subject });
        log("CMS: Saved to admin inbox successfully");
    } catch (cmsErr: any) {
        log(`CMS Save Error: ${cmsErr.message}`);
    }

    // 1. Respond IMMEDIATELY
    res.status(200).json({ message: 'Message received!' });

    // 2. Process in Background
    (async () => {
        // A. DB Save if Mongoose is ready
        if (mongoose.connection && mongoose.connection.readyState === 1) {
            try {
                await Contact.create({ name, email, subject, message });
                log("DB: Saved successfully");
            } catch (dbError: any) {
                log(`DB Error: ${dbError.message}`);
            }
        }

        // B. Email dispatch if credentials exist
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            log(`EMAIL CONFIG NOTE: User=${!!process.env.EMAIL_USER}, Pass=${!!process.env.EMAIL_PASS}`);
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
        }
    })().catch(err => {
        log(`ASYNC HANDLER NOTE: ${err.message}`);
    });
});

export default router;
