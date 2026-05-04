import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.route.js';
import aiRouter from './routes/ai.route.js';
import cookieParser from 'cookie-parser';
import interviewRouter from './routes/interview.route.js';

const app = express();

const defaultAllowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5174',
    'http://localhost:5175',
    'http://127.0.0.1:5175'
];

const envAllowedOrigins = (process.env.CORS_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

const allowedOrigins = envAllowedOrigins.length > 0 ? envAllowedOrigins : defaultAllowedOrigins;

const corsOptions = {
    origin(origin, callback) {
        // Allow non-browser tools (Postman/curl) and whitelisted browser origins.
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.get('/health', (req, res) => {
    return res.status(200).json({
        status: 'ok',
        service: 'yt-genai-backend'
    });
});

// jitni bhi auth routes ko access karni hai prefi diya gaya hai usse use karo

app.use('/api/auth', authRouter);   
app.use('/api/ai', aiRouter);

app.use('/api/interview', interviewRouter);

export default app;


