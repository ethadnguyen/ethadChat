import UserRepository from '../repositories/UserRepository.js';
import AppError from '../errors/AppError.js';
import { verifyAccessToken } from '../utils/jwt.util.js';

export const socketAuthMiddleware = async (socket, next) => {
    try {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new AppError('Không tìm thấy access token', 401));
        }

        const decoded = await verifyAccessToken(token);
        if (!decoded) {
            return next(new AppError('Access token không hợp lệ', 403));
        }

        const user = await UserRepository.findByIdWithoutPassword(decoded.userId);

        if (!user) {
            return next(new AppError('User không tồn tại', 404));
        }

        socket.user = user;
        next();
    } catch (error) {
        next(error);
    }
}