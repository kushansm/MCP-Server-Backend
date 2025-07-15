# MCP Server – Backend

This is the backend service for the MCP (Model Context Protocol) Server. It enables resume parsing, AI-powered Q&A, and email notifications.

---

## ✨ Features

- 📄 Upload resumes (PDF) and extract raw text + email
- 🤖 Ask resume-related questions using Cohere AI
- 📧 Send emails to extracted or custom recipients

---

## ⚙️ Tech Stack

- Node.js + Express
- Multer (for file uploads)
- `pdf-parse` (PDF text extraction)
- Cohere API (for AI Q&A)
- Nodemailer (SMTP email sending)
- dotenv (environment configuration)

---

## 📁 Project Structure



---

## 🧪 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/mcp-server-backend.git
cd mcp-server-backend
npm install
````

### 2. Create `.env` File

Inside the root folder, create a `.env` file with the following content:

```env
PORT=3001

# SMTP Config (Gmail recommended with App Password)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Cohere AI Config
COHERE_API_KEY=your-cohere-api-key
```

> 💡 To get a Cohere API key, visit: [https://dashboard.cohere.com/](https://dashboard.cohere.com/)

---

### 🚀 Run the Server

```bash
npm start
```

By default, the server runs at:

📍 `http://localhost:3001`

---

## 🔌 API Endpoints

| Method | Endpoint             | Description                                |
| ------ | -------------------- | ------------------------------------------ |
| POST   | `/resume/upload`     | Upload resume PDF and extract text/email   |
| GET    | `/resume/chat?q=...` | Ask a question about the resume            |
| POST   | `/email`             | Send an email using extracted/custom email |

---

## 🌐 Environment Variables

| Key              | Description                           |
| ---------------- | ------------------------------------- |
| `PORT`           | Port to run the server (e.g., 3001)   |
| `EMAIL_USER`     | Your SMTP email address (e.g., Gmail) |
| `EMAIL_PASS`     | SMTP password or Gmail App Password   |
| `COHERE_API_KEY` | API key for Cohere AI                 |

---

## 🙌 Acknowledgements

* [Cohere](https://cohere.com) – Language model API
* [Nodemailer](https://nodemailer.com) – Email service
* [pdf-parse](https://www.npmjs.com/package/pdf-parse) – PDF parsing


