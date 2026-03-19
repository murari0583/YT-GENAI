import mongoose from 'mongoose';


async function connectDB(){
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
        throw new Error('MONGO_URI is not set in .env');
    }

    if (mongoUri.includes('<db_username>') || mongoUri.includes('<db_password>')) {
        throw new Error('MONGO_URI contains placeholder values. Replace <db_username> and <db_password> with real MongoDB Atlas credentials.');
    }

    try{
        await mongoose.connect(mongoUri)
        console.log('Connected to MongoDB')
    } catch (error) {
        console.error('Error connecting to MongoDB:', error)
        throw error;
    }
}

export default connectDB;