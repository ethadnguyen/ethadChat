import ConversationService from '../services/conversationService.js';

export const getConversation = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const conversations = await ConversationService.getConversations(userId);
        return res.status(200).json({
            message: 'Cuộc trò chuyện đã được lấy thành công',
            conversations,
        });
    } catch (error) {
        next(error);
    }
}

export const getMessages = async (req, res, next) => {
    try {
        const { conversationId } = req.params;
        const { limit, cursor } = req.query;

        const result = await ConversationService.getMessages(conversationId, {
            limit,
            cursor,
            populate: false
        });

        return res.status(200).json({
            message: 'Tin nhắn đã được lấy thành công',
            ...result
        });
    } catch (error) {
        next(error);
    }
}

export const createConversation = async (req, res, next) => {
    try {
        const { type, name, memberIds } = req.body;
        const userId = req.user._id;

        const conversation = await ConversationService.createConversation(type, name, memberIds, userId);

        return res.status(201).json({
            message: 'Cuộc trò chuyện đã được tạo thành công',
            conversation,
        });
    } catch (error) {
        next(error);
    }
}
