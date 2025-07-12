import fs from 'fs';
import pdfParse from 'pdf-parse/lib/pdf-parse.js';

export const extractTextFromPDF = async (filePath) => {
    const fileBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(fileBuffer);
    return data.text;
};
