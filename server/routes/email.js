import express from 'express';
const router = express.Router();

router.post('/', (req, res) => {
    const { to, subject, body } = req.body;
    res.send(`Email would be sent to ${to} with subject: "${subject}"`);
});

export default router;
