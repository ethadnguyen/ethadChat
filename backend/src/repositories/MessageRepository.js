import Message from '../models/Message.js';

class MessageRepository {
  async findById(messageId, populate = false) {
    const query = Message.findById(messageId);
    if (populate) {
      query.populate('senderId', 'displayName avatarUrl')
        .populate('conversationId');
    }
    return await query;
  }

  async create(messageData) {
    return await Message.create(messageData);
  }

  async findByConversationId(conversationId, options = {}) {
    const { limit, cursor, populate = false } = options;
    const filter = { conversationId };
    
    if (cursor) {
      filter.createdAt = { $lt: new Date(cursor) };
    }
    
    const query = Message.find(filter)
      .sort({ createdAt: -1 });

    if (limit) {
      query.limit(Number(limit));
    }

    if (populate) {
      query.populate('senderId', 'displayName avatarUrl')
        .populate('conversationId');
    }

    return await query;
  }

  async findLatestByConversationId(conversationId, populate = false) {
    const query = Message.findOne({ conversationId })
      .sort({ createdAt: -1 });
    if (populate) {
      query.populate('senderId', 'displayName avatarUrl')
        .populate('conversationId');
    }
    return await query;
  }

  async countByConversationId(conversationId) {
    return await Message.countDocuments({ conversationId });
  }

  async updateById(messageId, updateData) {
    return await Message.findByIdAndUpdate(messageId, updateData, { new: true });
  }

  async deleteById(messageId) {
    return await Message.findByIdAndDelete(messageId);
  }

  async deleteByConversationId(conversationId) {
    return await Message.deleteMany({ conversationId });
  }

  async findBySenderId(senderId, populate = false) {
    const query = Message.find({ senderId }).sort({ createdAt: -1 });
    if (populate) {
      query.populate('senderId', 'displayName avatarUrl')
        .populate('conversationId');
    }
    return await query;
  }
}

export default new MessageRepository();

