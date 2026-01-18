import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  socketPort: process.env.SOCKET_PORT || 3001,
  env: process.env.NODE_ENV || 'development',
  
  database: {
    uri: process.env.MONGODB_URI,
  },
  
  jwt: {
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    accessTokenTTL: '30m',
    refreshTokenTTL: 14 * 24 * 60 * 60 * 1000,
  },
  
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
};

