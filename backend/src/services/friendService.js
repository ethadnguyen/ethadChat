import AppError from '../errors/AppError.js';
import FriendRepository from '../repositories/FriendRepository.js';

class FriendService {
    async getAllFriends(userId) {
        const friends = await FriendRepository.findByUserId(userId);
        
        const formattedFriends = friends.map(friend => {
            const friendUser = friend.userA._id.toString() === userId.toString() 
                ? friend.userB 
                : friend.userA;
            return {
                _id: friend._id,
                friend: friendUser,
                createdAt: friend.createdAt
            };
        });

        return formattedFriends;
    }

    async getAllFriendRequests(userId) {
        const friendRequests = await FriendRepository.findFriendRequestsReceived(userId);
        return friendRequests;
    }

    async sendFriendRequest(from, to, message) {
        if (from.toString() === to.toString()) {
            throw new AppError('Bạn không thể gửi yêu cầu kết bạn cho chính mình', 400);
        }

        const [alreadyFriends, existingRequest] = await Promise.all([
            FriendRepository.findByUserAAndUserB(from, to),
            FriendRepository.findFriendRequestByFromAndTo(from, to),
        ]);

        if (alreadyFriends) {
            throw new AppError('Hai người đã là bạn bè', 400);
        }

        if (existingRequest) {
            throw new AppError('Yêu cầu kết bạn đã tồn tại', 400);
        }

        const friendRequest = await FriendRepository.createFriendRequest({
            from,
            to,
            message
        });

        return await FriendRepository.findFriendRequestById(friendRequest._id, true);
    }

    async acceptFriendRequest(userId, requestId) {
        const friendRequest = await FriendRepository.findFriendRequestById(requestId);
        
        if (!friendRequest) {
            throw new AppError('Yêu cầu kết bạn không tồn tại', 404);
        }

        if (friendRequest.to.toString() !== userId.toString()) {
            throw new AppError('Bạn không có quyền chấp nhận yêu cầu này', 403);
        }

        const alreadyFriends = await FriendRepository.findByUserAAndUserB(
            friendRequest.from, 
            friendRequest.to
        );

        if (alreadyFriends) {
            await FriendRepository.deleteFriendRequestById(requestId);
            throw new AppError('Hai người đã là bạn bè', 400);
        }

        await FriendRepository.create({
            userA: friendRequest.from,
            userB: friendRequest.to
        });

        await FriendRepository.deleteFriendRequestById(requestId);

        const friend = await FriendRepository.findByUserAAndUserB(
            friendRequest.from, 
            friendRequest.to,
            true
        );

        return friend;
    }

    async declineFriendRequest(userId, requestId) {
        const friendRequest = await FriendRepository.findFriendRequestById(requestId);
        
        if (!friendRequest) {
            throw new AppError('Yêu cầu kết bạn không tồn tại', 404);
        }

        if (friendRequest.to.toString() !== userId.toString()) {
            throw new AppError('Bạn không có quyền từ chối yêu cầu này', 403);
        }

        await FriendRepository.deleteFriendRequestById(requestId);
    }
}

export default new FriendService();

