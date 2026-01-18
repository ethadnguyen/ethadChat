import ConversationRepository from '../repositories/ConversationRepository.js';
import MessageRepository from '../repositories/MessageRepository.js';
import AppError from '../errors/AppError.js';
import { getIO } from '../socket/index.js';
import { emitNewMessage } from '../utils/message.util.js';

class MessageService {
    async sendDirectMessage(recipientId, senderId, content, conversationId) {
        if (!content) {
            throw new AppError('Nội dung tin nhắn không được để trống', 400);
        }

        let conversation;
        if (conversationId) {
            conversation = await ConversationRepository.findById(conversationId);
        }

        if (!conversation) {
            conversation = await ConversationRepository.create({
                type: 'direct',
                participants: [
                    { userId: senderId },
                    { userId: recipientId, joinedAt: new Date() }
                ],
                lastMessageAt: new Date(),
                unreadCounts: new Map(),
            });
        }

        const message = await MessageRepository.create({
            conversationId: conversation._id,
            senderId: senderId,
            content: content,
            createdAt: new Date(),
        });

        const participantIds = conversation.participants.map(p => p.userId);
        await ConversationRepository.updateAfterNewMessage(
            conversation._id,
            message,
            senderId,
            participantIds
        );

        const io = getIO();
        if (io) {
            emitNewMessage(io, conversation, message);
        }
        
        return await MessageRepository.findById(message._id);
    }

    async sendGroupMessage(conversationId, senderId, content) {
        if (!content) {
            throw new AppError('Nội dung tin nhắn không được để trống', 400)
        }
        const conversation = await ConversationRepository.findById(conversationId)
        if (!conversation) {
            throw new AppError('Cuộc trò chuyện không tồn tại', 404)
        }

        const message = await MessageRepository.create({
            conversationId: conversation._id,
            senderId: senderId,
            content: content,
        })

        const participantIds = conversation.participants.map(p => p.userId);
        await ConversationRepository.updateAfterNewMessage(
            conversation._id,
            message,
            senderId,
            participantIds
        )

        const io = getIO();
        if (io) {
            emitNewMessage(io, conversation, message);
        }

        return await MessageRepository.findById(message._id);
    }
}

export default new MessageService();