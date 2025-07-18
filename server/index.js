import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import resumeRouter from './routes/resume.js';
import emailRouter from './routes/email.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('MCP Server is up and running!');
});

app.use('/resume', resumeRouter);
app.use('/email', emailRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`MCP server running on port ${PORT}`);
});
