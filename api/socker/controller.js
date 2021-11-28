import { Server } from 'socket.io';

const app = app => {
  const io = new Server(app, {
    path: '/websocket',
    cookie: 'websocket:session',
    pingTimeout: 30000,
    cors: {
      origin: 'http://localhost:3000'
    }
  });

};

export default app;
