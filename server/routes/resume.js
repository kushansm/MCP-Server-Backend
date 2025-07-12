import express from 'express';
import multer from 'multer';
import { extractTextFromPDF } from '../utils/parser.js';
import { askAboutResume } from '../utils/chat.js';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// store uploaded resume temporarily
let lastUploadedResumePath = null;

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

router.post('/upload', upload.single('resume'), (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    res.json({ message: 'Resume uploaded!', filename: req.file.filename });
});

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

export default router;
