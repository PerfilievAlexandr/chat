const config = require('config');
const socketIO = require('socket.io');
const socketRedis = require('socket.io-redis');
const cookie = require('cookie');

const sessionStore = require('./sessionStore');
const { User } = require('../models/User');

const socket = (server) => {
  const io = socketIO(server);

  io.adapter(socketRedis(config.get('redis.uri')))

  io.use(async (socket, next) => {
    const sessionId = cookie.parse(socket.request.headers.cookie)['koa.sess'];

    if (!sessionId) {
      return next(new Error('Missing auth cookie'));
    }

    const session = await sessionStore.get(sessionId);

    if (!session) {
      return next(new Error('No session'));
    }

    if (!session.passport?.user) {
      return next(new Error('No session'));
    }

    socket.user = await User.findById(session.passport.user);

    session.socketIds = session.socketIds
      ? session.socketIds.concat(socket.id)
      : [socket.id];

    await sessionStore.set(sessionId, session, null, {rolling: true});

    socket.on('disconnect', async () => {
      try {
        const session = await sessionStore.get(sessionId);

        if (session) {
          session.socketIds.splice(session.socketIds.indexOf(socket.id), 1);
          await sessionStore.set(sessionId, session, null, {rolling: true});
        }
      } catch {}
    });

    next();
  });

  io.on('connection', socket => {
    socket.broadcast.emit('newConnection', `connected ${socket.user.name}`);

    socket.on('newMessage', (message) => {
      io.emit('message', {
        user: socket.user.name,
        message
      })
    });
  })
};

module.exports = socket;
