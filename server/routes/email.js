import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Create email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// POST /email
router.post('/', async (req, res) => {
    const { recipient, subject, body } = req.body;

    if (!recipient || !subject || !body) {
        return res.status(400).json({ error: 'recipient, subject, and body are required' });
    }

    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: recipient,
            subject: subject,
            text: body,
        });

        res.json({ message: 'Email sent', info });
    } catch (err) {
        res.status(500).json({ error: 'Failed to send email', details: err.message });
    }
});

export default router;
