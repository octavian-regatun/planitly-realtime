import { Server, Socket } from 'socket.io';
import { ArrayUtils } from './utils/arrayUtils.js';

type ServerToClientEvents = {
  presence: (users: { id: string }[]) => void;
};

type ClientToServerEvents = object;

type MySocket = Socket<ClientToServerEvents, ServerToClientEvents>;

const io = new Server<ClientToServerEvents, ServerToClientEvents>({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const onConnection = (socket: MySocket) => {
  const users = [] as { id: string }[];
  io.sockets.sockets.forEach((s) =>
    s.handshake.auth.user ? users.push(s.handshake.auth.user) : null,
  );

  const deduplicatedUsers = ArrayUtils.deduplicate(users, 'id');

  io.emit('presence', deduplicatedUsers);

  socket.on('disconnecting', () => {
    const users = [] as { id: string }[];
    io.sockets.sockets.forEach((s) =>
      s.handshake.auth.user ? users.push(s.handshake.auth.user) : null,
    );

    const index = users.findIndex(
      (u) => u.id === socket.handshake.auth.user.id,
    );
    if (index > -1) {
      users.splice(index, 1);
    }

    const deduplicatedUsers = ArrayUtils.deduplicate(users, 'id');

    io.emit('presence', deduplicatedUsers);
  });
};

io.on('connection', onConnection);

io.listen(parseInt(process.env.PORT) || 8080);

console.log(`Realtime server is listening on port ${process.env.PORT || 8080}`);
