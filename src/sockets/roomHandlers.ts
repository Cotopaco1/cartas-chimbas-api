import { Server, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid'; // Instalar: pnpm add uuid && pnpm add -D @types/uuid
import { RoomStore } from '../services/RoomStore';

export const registerRoomHandlers = (io: Server, socket: Socket) => {

  // Evento: Crear Sala
  socket.on('room:create', async (data: { hostId: number, maxPlayers: number }) => {
    console.log("Nueva data llegada de room:create : ", data);
    try {
      const roomId = uuidv4();
      
      // 1. Guardar en Redis (estado efímero)
      await RoomStore.create({
        id: roomId,
        hostId: data.hostId,
        maxPlayers: data.maxPlayers || 10,
        status: 'waiting',
        players: [socket.id],
        createdAt: Date.now(),
      });

      // 2. Unir al socket a la sala (Socket.io Rooms)
      socket.join(roomId);

      // 3. Responder al cliente que creó la sala
      socket.emit('room:created', { roomId, success: true });
      
      console.log(`Sala ${roomId} creada por Host ${data.hostId}`);

    } catch (error) {
      console.error(error);
      socket.emit('error', { message: 'Error al crear la sala' });
    }
  });

  // Evento: Unirse a Sala
  socket.on('room:join', async (roomId: string) => {
    const room = await RoomStore.join(roomId, socket.id);

    if (room && room.status === 'waiting') {
      socket.join(roomId);
      io.to(roomId).emit('room:player_joined', { userId: socket.id });
    } else {
      socket.emit('error', { message: 'Sala no encontrada o llena' });
    }
  });
};
