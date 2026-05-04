# YT-GENAI

Full-stack AI interview preparation app with authentication, interview report generation, and tailored resume generation.

## Repository Structure

- backend: Express API, auth, interview endpoints, Gemini integration.
- frontend: React + Vite client for auth and interview workflows.

## Tech Stack

- Frontend: React, Vite, React Router, Axios
- Backend: Node.js, Express, MongoDB, Mongoose
- AI: Google Gemini via @google/genai

## Quick Start

### 1) Clone and Install

Backend:

1. cd backend
2. npm install

Frontend:

1. cd frontend
2. npm install

### 2) Configure Environment Variables

Backend (backend/.env):

- PORT=3000
- NODE_ENV=development
- MONGO_URI=your_mongodb_connection_string
- JWT_SECRET=your_long_random_secret
- GOOGLE_GENAI_API_KEY=your_gemini_api_key
- CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173

Frontend (frontend/.env):

- VITE_API_BASE_URL=http://localhost:3000

### 3) Run Locally

Backend:

1. cd backend
2. npm run dev

Frontend:

1. cd frontend
2. npm run dev

## Main API Endpoints

- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout
- GET /api/auth/me
- POST /api/ai/generate
- POST /api/ai/resume-pdf
- POST /api/interview/

## Deployment Notes

- Use backend/.env.example and frontend/.env.example as templates.
- Never commit real .env files.
- If Gemini key is revoked or flagged as leaked, rotate key and restart backend.

## Deploying On Railway

This repository is a monorepo, so the cleanest setup on Railway is to create one service for the backend and, if you want to host the client there too, a second service for the frontend.

### Backend Service

1. Create a new Railway project and connect this GitHub repository.
2. Set the service root directory to backend.
3. Use these values:
  - Build command: npm install
  - Start command: npm start
4. Add the following environment variables in Railway:
  - PORT=3000
  - NODE_ENV=production
  - MONGO_URI=your_mongodb_connection_string
  - JWT_SECRET=your_long_random_secret
  - GOOGLE_GENAI_API_KEY=your_new_gemini_api_key
  - CORS_ORIGINS=your-frontend-domain,https://your-railway-frontend-domain
5. Deploy and copy the Railway backend URL.
6. After deploy, verify the service with /health.

### Frontend Service

You have two options:

1. Deploy the frontend on Railway as a separate static/web service.
2. Deploy the frontend on Vercel or Netlify and point it at the Railway backend.

If you deploy the frontend on Railway:

1. Set the service root directory to frontend.
2. Use these values:
  - Build command: npm install && npm run build
  - Start command: npm run preview -- --host 0.0.0.0 --port $PORT
3. Add this environment variable:
  - VITE_API_BASE_URL=https://your-railway-backend-domain

### Recommended Order

1. Deploy MongoDB first or use MongoDB Atlas.
2. Deploy the backend service and verify /api/auth/me or /api/ai/generate.
3. Deploy the frontend and update VITE_API_BASE_URL.
4. Update CORS_ORIGINS on the backend to include the final frontend URL.

## Troubleshooting

- 403 PERMISSION_DENIED from Gemini:
  - Create a new Gemini API key.
  - Update GOOGLE_GENAI_API_KEY in backend/.env.
  - Restart backend process.
- CORS errors:
  - Add your frontend domain to CORS_ORIGINS in backend .env.
