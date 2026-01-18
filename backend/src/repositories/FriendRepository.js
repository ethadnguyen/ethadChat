import Friend from '../models/Friend.js';
import FriendRequest from '../models/FriendRequest.js';

class FriendRepository {
  async create(friendData) {
    return await Friend.create(friendData);
  }

  async findByUserAAndUserB(userA, userB, populate = false) {
    let sortedUserA = userA.toString();
    let sortedUserB = userB.toString();
    if (sortedUserA > sortedUserB) {
      [sortedUserA, sortedUserB] = [sortedUserB, sortedUserA];
    }
    const query = Friend.findOne({ 
      userA: sortedUserA, 
      userB: sortedUserB 
    });
    if (populate) {
      query.populate('userA', 'displayName avatarUrl').populate('userB', 'displayName avatarUrl');
    }
    return await query;
  }

  async findByUserId(userId) {
    return await Friend.find({ 
      $or: [{ userA: userId }, { userB: userId }] 
    }).populate('userA', 'displayName avatarUrl').populate('userB', 'displayName avatarUrl');
  }

  async deleteByUserAAndUserB(userA, userB) {
    let sortedUserA = userA.toString();
    let sortedUserB = userB.toString();
    if (sortedUserA > sortedUserB) {
      [sortedUserA, sortedUserB] = [sortedUserB, sortedUserA];
    }
    return await Friend.findOneAndDelete({ 
      userA: sortedUserA, 
      userB: sortedUserB 
    });
  }

  async deleteByUserId(userId) {
    return await Friend.deleteMany({ 
      $or: [{ userA: userId }, { userB: userId }] 
    });
  }

  async createFriendRequest(friendRequestData) {
    return await FriendRequest.create(friendRequestData);
  }

  async findFriendRequestByFromAndTo(from, to) {
    return await FriendRequest.findOne({
      $or: [
        { from, to },
        { from: to, to: from }
      ]
    });
  }

  async findFriendRequestsByUserId(userId) {
    return await FriendRequest.find({
      $or: [
        { from: userId },
        { to: userId }
      ]
    })
    .populate('from', 'displayName avatarUrl')
    .populate('to', 'displayName avatarUrl')
    .sort({ createdAt: -1 });
  }

  async findFriendRequestsReceived(userId) {
    return await FriendRequest.find({ to: userId })
      .populate('from', 'displayName avatarUrl')
      .sort({ createdAt: -1 });
  }

  async findFriendRequestsSent(userId) {
    return await FriendRequest.find({ from: userId })
      .populate('to', 'displayName avatarUrl')
      .sort({ createdAt: -1 });
  }

  async findFriendRequestById(friendRequestId, populate = false) {
    const query = FriendRequest.findById(friendRequestId);
    if (populate) {
      query.populate('from', 'displayName avatarUrl').populate('to', 'displayName avatarUrl');
    }
    return await query;
  }

  async deleteFriendRequestById(friendRequestId) {
    return await FriendRequest.findByIdAndDelete(friendRequestId);
  }

  async deleteFriendRequestByFromAndTo(from, to) {
    return await FriendRequest.findOneAndDelete({
      $or: [
        { from, to },
        { from: to, to: from }
      ]
    });
  }
}

export default new FriendRepository();

