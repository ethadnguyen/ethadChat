import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';

export const generateAccessToken = (userId) => {
  return jwt.sign(
    { userId },
    config.jwt.accessTokenSecret,
    { expiresIn: config.jwt.accessTokenTTL }
  );
};

export const verifyAccessToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.jwt.accessTokenSecret, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
};

