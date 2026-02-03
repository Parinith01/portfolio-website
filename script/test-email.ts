
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';

// Load .env from root
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

console.log("Testing Email Configuration...");
console.log(`User: ${process.env.EMAIL_USER}`);
console.log(`Pass: ${process.env.EMAIL_PASS ? '******' : 'MISSING'}`);

async function testEmail() {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error("Missing EMAIL_USER or EMAIL_PASS in .env");
        process.exit(1);
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: "Test Email from Portfolio Debugger",
            text: "If you receive this, your email configuration works!",
        });
        console.log("Email sent successfully!");
        console.log("Message ID:", info.messageId);
    } catch (error) {
        console.error("Failed to send email:", error);
    }
}

testEmail();
