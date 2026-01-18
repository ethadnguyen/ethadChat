import Conversation from '../models/Conversation.js';

class ConversationRepository {
  async findById(conversationId, populate = false) {
    const query = Conversation.findById(conversationId);
    if (populate) {
      query.populate('participants.userId', 'displayName avatarUrl'),
        { path: 'seenBy', select: 'displayName avatarUrl' },
        { path: 'lastMessage.senderId', select: 'displayName avatarUrl' },
        { path: 'group.createdBy', select: 'displayName avatarUrl' };
    }
    return await query;
  }

  async create(conversationData) {
    return await Conversation.create(conversationData);
  }

  async findByParticipants(userId1, userId2, populate = false) {
    const query = Conversation.findOne({
      type: 'direct',
      'participants.userId': { $all: [userId1, userId2] }
    });
    if (populate) {
      query.populate('participants.userId', 'displayName avatarUrl')
        .populate('lastMessage.senderId', 'displayName avatarUrl');
    }
    return await query;
  }

  async findByGroupParticipants(memberIds, populate = false) {
    const query = Conversation.findOne({
      type: 'group',
      'participants.userId': { $all: memberIds }
    });
    if (populate) {
      query.populate('participants.userId', 'displayName avatarUrl')
        .populate('lastMessage.senderId', 'displayName avatarUrl');
    }
    return await query;
  }

  async findByUserId(userId, populate = false) {
    const query = Conversation.find({
      'participants.userId': userId
    }).sort({ lastMessageAt: -1, updatedAt: -1 });
    if (populate) {
      query.populate('participants.userId', 'displayName avatarUrl')
        .populate('lastMessage.senderId', 'displayName avatarUrl')
        .populate('group.createdBy', 'displayName avatarUrl');
    }
    return await query;
  }

  async updateById(conversationId, updateData) {
    return await Conversation.findByIdAndUpdate(conversationId, updateData, { new: true });
  }

  async updateLastMessage(conversationId, lastMessageData) {
    return await Conversation.findByIdAndUpdate(
      conversationId,
      {
        lastMessage: lastMessageData,
        lastMessageAt: new Date()
      },
      { new: true }
    );
  }

  async incrementUnreadCount(conversationId, userId) {
    return await Conversation.findByIdAndUpdate(
      conversationId,
      {
        $inc: { [`unreadCounts.${userId}`]: 1 }
      },
      { new: true }
    );
  }

  async resetUnreadCount(conversationId, userId) {
    return await Conversation.findByIdAndUpdate(
      conversationId,
      {
        $set: { [`unreadCounts.${userId}`]: 0 }
      },
      { new: true }
    );
  }

  async updateAfterNewMessage(conversationId, message, senderId, participantIds) {
    const updateData = {
      $set: {
        lastMessage: {
          _id: message._id.toString(),
          content: message.content,
          senderId: senderId,
          createdAt: message.createdAt || new Date()
        },
        lastMessageAt: new Date(),
        seenBy: []
      }
    };

    participantIds.forEach(participantId => {
      if (participantId.toString() !== senderId.toString()) {
        updateData.$inc = updateData.$inc || {};
        updateData.$inc[`unreadCounts.${participantId.toString()}`] = 1;
      } else {
        updateData.$set[`unreadCounts.${participantId.toString()}`] = 0;
      }
    });

    return await Conversation.findByIdAndUpdate(
      conversationId,
      updateData,
      { new: true }
    );
  }

  async deleteById(conversationId) {
    return await Conversation.findByIdAndDelete(conversationId);
  }
}

export default new ConversationRepository();

