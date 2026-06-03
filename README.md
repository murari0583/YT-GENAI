# 🤖 YT-GenAI

> AI-powered interview preparation platform — resume parsing, Gemini-generated interview reports, and tailored resume creation. Built with React, Node.js, and MongoDB.

---

## ✨ Features

- 🔐 **JWT Authentication** — Register, login, logout, and session management
- 📄 **Resume Parsing** — Upload a PDF or paste plain text
- 🧠 **AI Interview Reports** — Powered by Google Gemini
- 📝 **Tailored Resume Generation** — Match your resume to any job description
- 🗄️ **MongoDB Persistence** — Users and interview reports stored securely
- 🖥️ **React Frontend** — Protected routes, resume upload UI, and report viewer

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React `v19` + Vite `v7` |
| Routing | React Router `v7` |
| HTTP Client | Axios |
| Styling | SASS / SCSS |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| AI | Google GenAI SDK (Gemini) |
| Validation | Zod |
| Auth | JWT + bcrypt |

---

## 📁 Project Structure

```
/
├── frontend/               # React + Vite app
│   ├── src/
│   │   ├── config/
│   │   │   └── api.js      # API base URL & URL builder
│   │   ├── features/
│   │   │   ├── auth/       # Auth context, hooks, pages & API service
│   │   │   └── interview/  # Interview pages & styles
│   │   └── main.jsx
│   └── package.json
│
└── backend/                # Node.js + Express API
    ├── src/
    │   └── server.js
    └── package.json
```

---

## 📋 Prerequisites

- Node.js `v20+`
- npm `v10+`
- A MongoDB connection string
- A [Google AI Studio](https://aistudio.google.com/) API key

---

## ⚙️ Environment Variables

### Backend — `backend/.env`

Copy `backend/.env.example` to `backend/.env`:

```env
PORT=3000
NODE_ENV=production
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
GOOGLE_GENAI_API_KEY=your_gemini_api_key
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

### Frontend — `frontend/.env`

Copy `frontend/.env.example` to `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:3000
```

> **Note:** `GEMINI_API_KEY` is also supported as a fallback if `GOOGLE_GENAI_API_KEY` is not set.  
> If Google marks a key as leaked, generate a new one in AI Studio and restart the server.

---

## 🚀 Getting Started

### Backend

```bash
cd backend
npm install
npm run dev       # development (with hot reload)
npm start         # production
```

Server runs at: **`http://localhost:3000`**

### Frontend

```bash
cd frontend
npm install
npm run dev       # development
npm run build     # production build
npm run preview   # preview production build
```

Dev server runs at: **`http://localhost:5173`**

---

## 📡 API Reference

### 🔑 Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Create a new account |
| `POST` | `/api/auth/login` | Log in and receive a token |
| `POST` | `/api/auth/logout` | Invalidate session |
| `GET` | `/api/auth/me` | Get current user |

### 🤖 AI

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/ai/generate` | Generate an interview report |
| `POST` | `/api/ai/resume-pdf` | Generate a tailored resume PDF |

**`/api/ai/generate` body:**
```json
{
  "resume": "...",
  "selfDescription": "...",
  "jobDescription": "..."
}
```

**`/api/ai/resume-pdf`** accepts `multipart/form-data` (PDF upload) or JSON-compatible fields.

### 📋 Interview

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/interview/` | Create interview report *(protected)* |

---

## 🐛 Common Errors

| Error Code | Cause | Fix |
|------------|-------|-----|
| `AI_API_KEY_MISSING` | No API key configured | Set `GOOGLE_GENAI_API_KEY` in `.env` |
| `AI_API_KEY_INVALID_OR_LEAKED` | Key revoked by Google | Rotate key in AI Studio and restart |
| `CORS blocked` | Frontend origin not allowed | Add your frontend URL to `CORS_ORIGINS` |

---

## 🔒 Security

- **Never commit `.env`** — keep it in `.gitignore`
- Use `.env.example` for safe, placeholder-only defaults
- Rotate leaked or revoked API keys immediately
- Use a strong, random `JWT_SECRET` in production

---

## 🚢 Deployment

See [`DEPLOY_RAILWAY.md`](./DEPLOY_RAILWAY.md) for step-by-step Railway deployment instructions.

---

<p align="center">Made with ❤️ using React, Node.js & Google Gemini</p>
