import Session from '../models/Session.js';

class SessionRepository {
  async create(sessionData) {
    return await Session.create(sessionData);
  }

  async findByRefreshToken(refreshToken) {
    return await Session.findOne({ refreshToken });
  }

  async findByUserId(userId) {
    return await Session.find({ userId });
  }

  async deleteByRefreshToken(refreshToken) {
    return await Session.findOneAndDelete({ refreshToken });
  }

  async deleteByUserId(userId) {
    return await Session.deleteMany({ userId });
  }

  async deleteExpiredSessions() {
    return await Session.deleteMany({ expiresAt: { $lt: new Date() } });
  }
}

export default new SessionRepository();

