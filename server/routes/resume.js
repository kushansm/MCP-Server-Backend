import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'server/uploads';

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        cb(null, uploadDir); // save files in this folder
    },
    filename: function (req, file, cb) {
        // Save file with original name and timestamp to avoid overwriting
        const timestamp = Date.now();
        const ext = path.extname(file.originalname);
        const base = path.basename(file.originalname, ext);
        cb(null, `${base}-${timestamp}${ext}`);
    }
});

const upload = multer({ storage: storage });

router.post('/upload', upload.single('resume'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    res.json({
        message: 'Resume uploaded and stored!',
        filename: req.file.filename,
        path: req.file.path
    });
});

// Dummy Q&A route
router.get('/chat', (req, res) => {
    const question = req.query.q;
    res.json({ answer: `You asked: ${question}` });
});

export default router;
