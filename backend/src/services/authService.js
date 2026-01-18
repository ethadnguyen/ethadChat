import UserRepository from '../repositories/UserRepository.js';
import SessionRepository from '../repositories/SessionRepository.js';
import { hashPassword, comparePassword } from '../utils/password.util.js';
import { generateAccessToken } from '../utils/jwt.util.js';
import { generateRefreshToken } from '../utils/crypto.util.js';
import { config } from '../config/index.js';
import AppError from '../errors/AppError.js';

class AuthService {
  async signup(userData) {
    const { username, email, password, firstName, lastName } = userData;

    if (!username || !email || !password || !firstName || !lastName) {
      throw new AppError('Không thể thiếu thông tin đăng ký', 400);
    }

    const existingUser = await UserRepository.findByUsernameOrEmail(username, email);
    if (existingUser) {
      throw new AppError('Username hoặc email đã tồn tại', 400);
    }

    const hashedPassword = await hashPassword(password);
    await UserRepository.create({
      username,
      email,
      hashedPassword,
      displayName: `${lastName} ${firstName}`,
    });
  }

  async signin(username, password) {
    if (!username || !password) {
      throw new AppError('Không thể thiếu thông tin đăng nhập', 400);
    }

    const user = await UserRepository.findByUsername(username);
    if (!user) {
      throw new AppError('Tài khoản hoặc mật khẩu không chính xác', 401);
    }

    const validPassword = await comparePassword(password, user.hashedPassword);
    if (!validPassword) {
      throw new AppError('Tài khoản hoặc mật khẩu không chính xác', 401);
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken();

    await SessionRepository.create({
      userId: user._id,
      refreshToken: refreshToken,
      expiresAt: new Date(Date.now() + config.jwt.refreshTokenTTL)
    });

    return {
      accessToken,
      refreshToken,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
      }
    };
  }

  async logout(refreshToken) {
    if (!refreshToken) {
      throw new AppError('Không tìm thấy refresh token', 401);
    }

    await SessionRepository.deleteByRefreshToken(refreshToken);
  }

  async refreshAccessToken(refreshToken) {
    if (!refreshToken) {
      throw new AppError('Không tìm thấy refresh token', 401);
    }

    const session = await SessionRepository.findByRefreshToken(refreshToken);
    if (!session) {
      throw new AppError('Refresh token không hợp lệ hoặc đã hết hạn', 403);
    }

    if (session.expiresAt < new Date()) {
      throw new AppError('Refresh token đã hết hạn', 403);
    }

    const accessToken = generateAccessToken(session.userId);
    return { accessToken };
  }
}

export default new AuthService();

