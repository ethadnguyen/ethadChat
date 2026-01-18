import { verifyAccessToken } from '../utils/jwt.util.js';
import UserRepository from '../repositories/UserRepository.js';
import AppError from '../errors/AppError.js';

export const protectedRoute = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            throw new AppError('Không tìm thấy access token', 401);
        }

        try {
            const decoded = await verifyAccessToken(token);
            const user = await UserRepository.findByIdWithoutPassword(decoded.userId);
            
            if (!user) {
                throw new AppError('User không tồn tại', 404);
            }
            
            req.user = user;
            next();
        } catch (error) {
            if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
                throw new AppError('Access token không hợp lệ', 403);
            }
            throw error;
        }
    } catch (error) {
        next(error);
    }
};

