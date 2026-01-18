import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import fs from 'fs';
import swaggerUi from 'swagger-ui-express';
import { config } from './config/index.js';
import { errorHandler } from './errors/errorHandler.js';
import authRoute from './routes/authRoute.js';
import userRoute from './routes/userRoute.js';
import friendRoute from './routes/friendRoute.js';
import messageRoute from './routes/messageRoute.js';
import conversationRoute from './routes/conversationRoute.js';
import { protectedRoute } from './middlewares/authMiddleware.js';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors(config.cors));

// swagger
const swaggerDocument = JSON.parse(fs.readFileSync('./src/swagger.json', 'utf8'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// public routes
app.use('/api/auth', authRoute);

// protected routes
app.use(protectedRoute);
app.use('/api/users', userRoute);
app.use('/api/friends', friendRoute);
app.use('/api/messages', messageRoute);
app.use('/api/conversations', conversationRoute);

// error handler
app.use(errorHandler);

export default app;

