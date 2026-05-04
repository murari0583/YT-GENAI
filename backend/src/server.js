import app from './app.js';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

function assertRequiredEnvVars() {
    const requiredVars = ['MONGO_URI', 'JWT_SECRET', 'GOOGLE_GENAI_API_KEY'];
    const missingVars = requiredVars.filter((name) => !process.env[name]);

    if (missingVars.length > 0) {
        throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }
}

const startServer = async () => {
    try {
        assertRequiredEnvVars();
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Server startup failed:', error.message);
        process.exit(1);
    }
};

startServer();
