import http from 'http';
import { Server } from 'socket.io';
import { socketAuthMiddleware } from '../middlewares/socketMiddleware.js';
import ConversationRepository from '../repositories/ConversationRepository.js';
let io;

const createSocketServer = (options) => {
  const server = http.createServer();
  io = new Server(server, options);
  io.use(socketAuthMiddleware);

  const onlineUsers = new Map();

  io.on('connection', async (socket) => {
    const user = socket.user;
    console.log(`${user.displayName} online with ${socket.id}`);

    onlineUsers.set(user._id, socket.id);
    io.emit('online-users', Array.from(onlineUsers.keys()));

    const conversationIds = await ConversationRepository.findByUserId(user._id);

    conversationIds.forEach(conversation => {
      socket.join(conversation._id);
    });

    socket.on('disconnect', () => {
      onlineUsers.delete(user._id);
      io.emit('online-users', Array.from(onlineUsers.keys()));
      console.log(`${user.displayName} offline with ${socket.id}`);
    });
  });

  return server;
};

const getIO = () => io;

export { createSocketServer, getIO };