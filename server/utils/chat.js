import { CohereClient } from 'cohere-ai';
import dotenv from 'dotenv';

dotenv.config();

const cohere = new CohereClient({
    token: process.env.COHERE_API_KEY,
});

export const askAboutResume = async (resumeText, question) => {
    const response = await cohere.chat({
        model: 'command-r-plus', // or 'command-r', depending on availability
        message: `Here is my resume:\n\n${resumeText}\n\nQuestion: ${question}`,
        temperature: 0.7,
        maxTokens: 300,
    });

    return response.text.trim();
};
