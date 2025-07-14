import express from 'express';
import multer from 'multer';
import { extractTextFromPDF } from '../utils/parser.js';
import { askAboutResume } from '../utils/chat.js';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Temporary state to hold uploaded file path and extracted email
let lastUploadedResumePath = null;
let extractedEmailFromResume = null;

//  Email extractor
function extractEmail(text) {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const matches = text.match(emailRegex);
    return matches ? matches[0] : null;
}

// Multer setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'server/uploads';
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const timestamp = Date.now();
        const ext = path.extname(file.originalname);
        const base = path.basename(file.originalname, ext);
        const fileName = `${base}-${timestamp}${ext}`;
        lastUploadedResumePath = path.join('server/uploads', fileName);
        cb(null, fileName);
    },
});

const upload = multer({ storage });

// Upload route
router.post('/upload', upload.single('resume'), async (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    try {
        const resumeText = await extractTextFromPDF(lastUploadedResumePath);
        extractedEmailFromResume = extractEmail(resumeText);

        res.json({
            message: 'Resume uploaded!',
            filename: req.file.filename,
            extractedEmail: extractedEmailFromResume || 'No email found in resume',
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to process resume', details: err.message });
    }
});

// Chat route
router.get('/chat', async (req, res) => {
    const question = req.query.q;
    if (!lastUploadedResumePath) return res.status(400).json({ error: 'No resume uploaded yet' });
    if (!question) return res.status(400).json({ error: 'No question provided' });

    try {
        const resumeText = await extractTextFromPDF(lastUploadedResumePath);
        const answer = await askAboutResume(resumeText, question);
        res.json({ answer });
    } catch (err) {
        res.status(500).json({ error: 'Failed to process resume', details: err.message });
    }
});

// Export state for use in other routes
export { extractedEmailFromResume };
export default router;
