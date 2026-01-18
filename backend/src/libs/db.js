import mongoose from 'mongoose';
import { config } from '../config/index.js';

export const connectDB = async () => {
    try {
        await mongoose.connect(config.database.uri);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};

