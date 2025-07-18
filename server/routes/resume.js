import express from 'express';
import multer from 'multer';
import { extractTextFromPDF } from '../utils/parser.js';
import { askAboutResume } from '../utils/chat.js';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Temporary state
let lastUploadedResumePath = null;
let extractedEmailFromResume = null;

// Helper: Extract email from text
function extractEmail(text) {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const matches = text.match(emailRegex);
    return matches ? matches[0] : null;
}

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'server/uploads';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const ext = path.extname(file.originalname);
        const base = path.basename(file.originalname, ext);
        const fileName = `${base}-${timestamp}${ext}`;
        lastUploadedResumePath = path.join('server/uploads', fileName);
        cb(null, fileName);
    },
});

const upload = multer({ storage });

/**
 * Root route for health check
 */
router.get('/', (req, res) => {
    res.send('✅ Resume Chat API is running. Upload a resume and ask questions using /upload and /chat.');
});

/**
 * Upload route - handle PDF resume uploads
 */
router.post('/upload', upload.single('resume'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
        const resumeText = await extractTextFromPDF(lastUploadedResumePath);
        extractedEmailFromResume = extractEmail(resumeText);

        res.json({
            message: 'Resume uploaded successfully!',
            filename: req.file.filename,
            extractedEmail: extractedEmailFromResume || 'No email found in resume',
        });
    } catch (err) {
        res.status(500).json({
            error: 'Failed to process resume',
            details: err.message,
        });
    }
});

/**
 * Chat route - Ask questions about uploaded resume
 */
router.get('/chat', async (req, res) => {
    const question = req.query.q;

    if (!lastUploadedResumePath) {
        return res.status(400).json({ error: 'No resume uploaded yet' });
    }

    if (!question) {
        return res.status(400).json({ error: 'No question provided' });
    }

    try {
        const resumeText = await extractTextFromPDF(lastUploadedResumePath);
        const answer = await askAboutResume(resumeText, question);
        res.json({ answer });
    } catch (err) {
        res.status(500).json({
            error: 'Failed to answer the question',
            details: err.message,
        });
    }
});

// Export shared email state
export { extractedEmailFromResume };
export default router;
