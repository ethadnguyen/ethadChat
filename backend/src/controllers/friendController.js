import friendService from '../services/friendService.js';
import userService from '../services/userService.js';
import AppError from '../errors/AppError.js';

export const getAllFriends = async (req, res, next) => {
    try {
        const friends = await friendService.getAllFriends(req.user._id);
        return res.status(200).json({
            message: 'Lấy danh sách bạn bè thành công',
            friends: friends
        });
    } catch (error) {
        next(error);
    }
}

export const getFriendRequests = async (req, res, next) => {
    try {
        const friendRequests = await friendService.getAllFriendRequests(req.user._id);
        return res.status(200).json({
            message: 'Lấy danh sách yêu cầu kết bạn thành công',
            friendRequests: friendRequests
        });
    } catch (error) {
        next(error);
    }
}

export const sendFriendRequest = async (req, res, next) => {
    try {
        const { to, message } = req.body;
        const from = req.user._id;

        const userExists = await userService.getUserById(to);

        if (!userExists) {
            throw new AppError('Người dùng không tồn tại', 404);
        }

        const friendRequest = await friendService.sendFriendRequest(from, to, message);
        return res.status(201).json({
            message: 'Gửi yêu cầu kết bạn thành công',
            request: friendRequest
        });
    } catch (error) {
        next(error);
    }
}

export const acceptFriendRequest = async (req, res, next) => {
    try {
        const { requestId } = req.params;
        const userId = req.user._id;

        const friend = await friendService.acceptFriendRequest(userId, requestId);
        return res.status(200).json({
            message: 'Chấp nhận yêu cầu kết bạn thành công',
            newFriend: friend
        });
    } catch (error) {
        next(error);
    }
}

export const declineFriendRequest = async (req, res, next) => {
    try {
        const { requestId } = req.params;
        const userId = req.user._id;

        await friendService.declineFriendRequest(userId, requestId);
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
}

