import UserRepository from '../repositories/UserRepository.js';
import AppError from '../errors/AppError.js';

class UserService {
  async getUserById(userId) {
    const user = await UserRepository.findByIdWithoutPassword(userId);
    if (!user) {
      throw new AppError('User không tồn tại', 404);
    }
    return user;
  }

  async updateUser(userId, updateData) {
    const user = await UserRepository.updateById(userId, updateData);
    if (!user) {
      throw new AppError('User không tồn tại', 404);
    }
    return user;
  }
}

export default new UserService();

