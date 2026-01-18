import User from '../models/User.js';

class UserRepository {
  async findById(userId) {
    return await User.findById(userId);
  }

  async findByIdWithoutPassword(userId) {
    return await User.findById(userId).select('-hashedPassword');
  }

  async findByUsername(username) {
    return await User.findOne({ username });
  }

  async findByEmail(email) {
    return await User.findOne({ email });
  }

  async findByUsernameOrEmail(username, email) {
    return await User.findOne({
      $or: [
        { username: username },
        { email: email }
      ]
    });
  }

  async create(userData) {
    return await User.create(userData);
  }

  async updateById(userId, updateData) {
    return await User.findByIdAndUpdate(userId, updateData, { new: true });
  }

  async deleteById(userId) {
    return await User.findByIdAndDelete(userId);
  }
}

export default new UserRepository();

