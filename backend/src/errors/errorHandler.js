import { config } from '../config/index.js';

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Lỗi hệ thống';

  if (config.env === 'development') {
    console.error('Error:', err);
    return res.status(statusCode).json({
      message,
      error: err.message,
      stack: err.stack
    });
  }

  return res.status(statusCode).json({
    message: statusCode === 500 ? 'Lỗi hệ thống' : message
  });
};

