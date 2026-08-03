
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load .env from root
const envPath = path.resolve(process.cwd(), '.env');
console.log(`Loading .env from: ${envPath}`);
dotenv.config({ path: envPath });

const logFile = path.resolve(process.cwd(), 'debug_manual.log');

const log = (msg: string) => {
    const time = new Date().toISOString();
    const line = `[${time}] ${msg}`;
    console.log(line);
    try {
        fs.appendFileSync(logFile, line + '\n');
    } catch (e) {
        console.error("Failed to write to log file:", e);
    }
};

log("--- Starting Manual Debug ---");
log(`CWD: ${process.cwd()}`);
log(`EMAIL_USER defined: ${!!process.env.EMAIL_USER}`);
if (process.env.EMAIL_USER) {
    log(`EMAIL_USER: ${process.env.EMAIL_USER}`);
}
log(`EMAIL_PASS defined: ${!!process.env.EMAIL_PASS}`);

async function testEmail() {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        log("ERROR: Missing EMAIL_USER or EMAIL_PASS in .env");
        return;
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS.replace(/^"|"$/g, ''),
        },
    });

    try {
        log("Attempting to send email...");
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: "Manual Debug Test",
            text: "If you receive this, the email credentials and network are working.",
        });
        log("SUCCESS: Email sent!");
        log(`Message ID: ${info.messageId}`);
    } catch (error: any) {
        log(`ERROR: Failed to send email: ${error.message}`);
        log(`Stack: ${error.stack}`);
    }
}

testEmail().catch(err => log(`FATAL: ${err.message}`));
