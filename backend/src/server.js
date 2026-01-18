import http from 'http';
import app from './app.js';
import { connectDB } from './libs/db.js';
import { config } from './config/index.js';
import { createSocketServer } from './socket/index.js';

const startServer = async () => {
    try {
        await connectDB();
        
        const server = http.createServer(app);
        server.listen(config.port, () => {
          console.log(`Server is running on port ${config.port}`);
        });

        const socketServer = createSocketServer({ cors: config.cors });
        socketServer.listen(config.socketPort, () => {
          console.log(`Socket server is running on port ${config.socketPort}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();

