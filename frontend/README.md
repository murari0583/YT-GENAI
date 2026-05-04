# YT-GENAI Frontend

React + Vite frontend for user auth and AI-powered interview preparation workflows.

## Features

- User registration and login UI.
- Protected routes for authenticated pages.
- Interview report flow with resume upload.
- Tailored resume generation workflow.
- API integration through centralized base URL config.

## Prerequisites

- Node.js 20+
- npm 10+
- Running backend server

## Environment Variables

Copy .env.example to .env and configure:

- VITE_API_BASE_URL=http://localhost:3000

## Install and Run

1. Install dependencies:
	npm install
2. Start development server:
	npm run dev
3. Build production bundle:
	npm run build
4. Preview production build:
	npm run preview

Default dev URL: http://localhost:5173

## Project Structure

- src/features/auth: auth context, hooks, pages, and API service.
- src/features/interview: interview pages and styling.
- src/config/api.js: API base URL and URL builder.

## Notes

- Ensure backend CORS includes your frontend origin.
- Keep frontend and backend base URLs aligned between local and deployed environments.
