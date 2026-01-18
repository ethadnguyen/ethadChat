import FriendRepository from '../repositories/FriendRepository.js';
import AppError from '../errors/AppError.js';
import ConversationRepository from '../repositories/ConversationRepository.js';

export const checkFriendship = async (req, res, next) => {
    try {
        const me = req.user._id.toString();
        const recipientId = req.body?.recipientId?.toString() ?? null;
        const memberIds = req.body?.memberIds ?? [];

        if (!recipientId && memberIds.length === 0) {
            throw new AppError('recipientId hoặc memberIds là bắt buộc', 400);
        }

        if (recipientId) {
            if (me === recipientId) {
                throw new AppError('Không thể thực hiện hành động với chính mình', 400);
            }

            const friend = await FriendRepository.findByUserAAndUserB(me, recipientId);
            if (!friend) {
                return res.status(403).json({
                    message: 'Bạn không phải là bạn bè của người dùng này',
                });
            }
        }

        if (memberIds.length > 0) {
            const memberIdsToCheck = memberIds
                .map(id => id.toString())
                .filter(id => id !== me);

            if (memberIdsToCheck.length === 0) {
                throw new AppError('Danh sách thành viên không hợp lệ', 400);
            }

            const friendChecks = memberIdsToCheck.map(async (memberId) => {
                const friend = await FriendRepository.findByUserAAndUserB(me, memberId);
                return !!friend;
            });

            const result = await Promise.all(friendChecks);
            if (result.some(friend => !friend)) {
                return res.status(403).json({
                    message: 'Bạn không phải là bạn bè của một số người dùng trong danh sách',
                });
            }
        }

        return next();
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        console.error('Lỗi khi kiểm tra tính bạn bè', error);
        throw new AppError('Lỗi hệ thống', 500);
    }
}

export const checkGroupMembership = async (req, res, next) => {
    try {
        const { conversationId } = req.body
        const userId = req.user._id

        const conversation = await ConversationRepository.findById(conversationId)

        if (!conversation) {
            throw new AppError('Cuộc trò chuyện không tồn tại', 404)
        }

        const isMember = conversation.participants.some(p => p.userId.toString() === userId.toString())

        if (!isMember) {
            throw new AppError('Bạn không phải là thành viên của nhóm này', 403)
        }

        return next();
    } catch (error) {
        next(error);
    }
}