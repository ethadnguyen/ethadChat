import ConversationRepository from '../repositories/ConversationRepository.js';
import MessageRepository from '../repositories/MessageRepository.js';
import AppError from '../errors/AppError.js';

class ConversationService {
    async createConversation(type, name, memberIds, userId) {
        if (!memberIds || !Array.isArray(memberIds) || memberIds.length === 0) {
            throw new AppError('Danh sách thành viên là bắt buộc', 400);
        }

        if (type === 'group' && !name) {
            throw new AppError('Tên nhóm là bắt buộc', 400);
        }

        if (type !== 'direct' && type !== 'group') {
            throw new AppError('Loại cuộc trò chuyện không hợp lệ', 400);
        }

        let conversation;

        if (type === 'direct') {
            const participantId = memberIds[0];
            conversation = await ConversationRepository.findByParticipants(userId, participantId);

            if (!conversation) {
                conversation = await ConversationRepository.create({
                    type: 'direct',
                    participants: [
                        { userId: userId },
                        { userId: participantId, joinedAt: new Date() }
                    ],
                    lastMessageAt: new Date(),
                    unreadCounts: new Map(),
                });
            }
        } else if (type === 'group') {
            conversation = await ConversationRepository.findByGroupParticipants(memberIds);
            if (!conversation) {
                conversation = await ConversationRepository.create({
                    type: 'group',
                    participants: [{ userId }, ...memberIds.map(id => ({ userId: id }))],
                    group: { name: name, createdBy: userId },
                    lastMessageAt: new Date(),
                    unreadCounts: new Map(),
                });
            }
        }

        return await ConversationRepository.findById(conversation._id, true);
    }

    async getConversations(userId) {
        const conversations = await ConversationRepository.findByUserId(userId, true);

        const formattedConversations = conversations.map(conversation => {
            const participants = conversation.participants.map((p) => ({
                _id: p.userId?._id,
                displayName: p.userId?.displayName,
                avatarUrl: p.userId?.avatarUrl ?? null,
                joinedAt: p.joinedAt,
            }));

            return {
                ...conversation.toObject(),
                unreadCounts: conversation.unreadCounts ?? new Map(),
                participants,
            }
        })

        return formattedConversations;
    }

    async getMessages(conversationId, options = {}) {
        const { limit = 20, cursor, populate = true } = options;
        
        if (!conversationId) {
            throw new AppError('Conversation ID là bắt buộc', 400);
        }

        const conversation = await ConversationRepository.findById(conversationId);
        if (!conversation) {
            throw new AppError('Cuộc trò chuyện không tồn tại', 404);
        }

        const messages = await MessageRepository.findByConversationId(
            conversationId, 
            { 
                limit: Number(limit) + 1, 
                cursor, 
                populate 
            }
        );

        let nextCursor = null;

        if (messages.length > Number(limit)) {
            const lastMessage = messages[messages.length - 1];
            nextCursor = lastMessage.createdAt.toISOString();
            messages.pop();
        }

        messages.reverse();

        return {
            messages,
            nextCursor
        };
    }
}

export default new ConversationService();