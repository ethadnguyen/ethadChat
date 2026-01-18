import MessageService from '../services/messageService.js';
import AppError from '../errors/AppError.js';

export const sendDirectMessage = async (req, res, next) => {
    try {
        const { recipientId, content, conversationId } = req.body;
        const senderId = req.user._id;

        const message = await MessageService.sendDirectMessage(recipientId, senderId, content, conversationId);

        return res.status(201).json({
            message,
        });

    } catch (error) {
        next(error);
    }
}

export const sendGroupMessage = async (req, res, next) => {
    try {
        const { conversationId, content } = req.body
        const senderId = req.user._id

        const message = await MessageService.sendGroupMessage(conversationId, senderId, content);

        return res.status(201).json({
            message,
        });
    } catch (error) {
        next(error)
    }
}