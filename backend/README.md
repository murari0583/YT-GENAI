# YT-GENAI Backend

Node.js + Express backend for authentication and AI-powered interview report generation.

## Features

- JWT auth with register, login, logout, and get current user endpoints.
- Resume parsing from PDF upload or plain text input.
- Interview report generation with Gemini model.
- Tailored resume PDF generation from resume + job description.
- MongoDB persistence for users and interview reports.

## Tech Stack

- Node.js
- Express
- MongoDB + Mongoose
- Google GenAI SDK
- Zod (schema validation)

## Prerequisites

- Node.js 20+
- npm 10+
- MongoDB connection string
- Gemini API key

## Environment Variables

Copy .env.example to .env and fill values:

- PORT=3000
- NODE_ENV=production
- MONGO_URI=your_mongodb_connection_string
- JWT_SECRET=your_long_random_secret
- GOOGLE_GENAI_API_KEY=your_gemini_api_key
- CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173

Notes:

- GEMINI_API_KEY is also supported as a fallback if GOOGLE_GENAI_API_KEY is not set.
- If Google marks a key as leaked, generate a new key and restart the backend.

## Install and Run

1. Install dependencies:
	 npm install
2. Start in development mode:
	 npm run dev
3. Start in production mode:
	 npm start

Default server URL: http://localhost:3000

## API Routes

### Auth

- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout
- GET /api/auth/get-me
- GET /api/auth/me

### AI

- POST /api/ai/generate
	- Body: resume, selfDescription, jobDescription
- POST /api/ai/resume-pdf
	- multipart/form-data or JSON-compatible fields
	- accepts resume as PDF file or text

### Interview

- POST /api/interview/
	- Protected route
	- accepts resume upload and interview context

## Common Errors

- AI_API_KEY_MISSING: configure GOOGLE_GENAI_API_KEY or GEMINI_API_KEY.
- AI_API_KEY_INVALID_OR_LEAKED: rotate key in Google AI Studio and restart server.
- CORS blocked: add your frontend URL in CORS_ORIGINS.

## Security

- Do not commit .env.
- Keep .env.example for safe defaults only.
- Rotate leaked/revoked API keys immediately.
