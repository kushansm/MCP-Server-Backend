import express from 'express';
const router = express.Router();

router.post('/upload', (req, res) => {
    res.json({ message: 'Resume uploaded!' });
});

router.get('/chat', (req, res) => {
    const question = req.query.q;
    res.json({ answer: `You asked: ${question}` });
});

export default router;
