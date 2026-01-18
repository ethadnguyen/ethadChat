import express from 'express';
import { getAllFriends, getFriendRequests, sendFriendRequest, acceptFriendRequest, declineFriendRequest } from '../controllers/friendController.js';
const router = express.Router();

router.get('/', getAllFriends);
router.get('/requests', getFriendRequests);

router.post('/requests', sendFriendRequest);
router.post('/requests/:requestId/accept', acceptFriendRequest);
router.post('/requests/:requestId/decline', declineFriendRequest);

export default router;

