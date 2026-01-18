import express from 'express';
import { createConversation, getConversation, getMessages } from '../controllers/conversationController.js';
import { checkFriendship } from '../middlewares/friendMiddleware.js';

const router = express.Router();

router.get('/', getConversation);
router.get('/:conversationId/messages', getMessages);
router.post('/', checkFriendship, createConversation);

export default router;