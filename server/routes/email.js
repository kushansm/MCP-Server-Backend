import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { extractedEmailFromResume } from './resume.js'; //  import extracted email

dotenv.config();

const router = express.Router();

// Email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Send email route
router.post('/', async (req, res) => {
    const { recipient, subject, body } = req.body;

    const toEmail = recipient || extractedEmailFromResume;

    if (!toEmail || !subject || !body) {
        return res.status(400).json({
            error: 'recipient (or extracted from resume), subject, and body are required',
        });
    }

    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: toEmail,
            subject,
            text: body,
        });

        res.json({ message: 'Email sent', info });
    } catch (err) {
        res.status(500).json({ error: 'Failed to send email', details: err.message });
    }
});

export default router;
