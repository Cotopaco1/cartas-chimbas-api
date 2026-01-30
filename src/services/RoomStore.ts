import { redis } from '../config/redis';

export type RoomState = {
  id: string;
  hostId: number;
  maxPlayers: number;
  status: 'waiting' | 'in_progress' | 'finished';
  players: string[];
  createdAt: number;
};

const ROOM_PREFIX = 'rooms';
const ROOM_TTL_SECONDS = Number(process.env.ROOM_TTL_SECONDS || 3600);

const key = (roomId: string) => `${ROOM_PREFIX}:${roomId}`;

export const RoomStore = {
  async create(state: RoomState) {
    await redis.set(key(state.id), JSON.stringify(state), 'EX', ROOM_TTL_SECONDS);
    return state.id;
  },

  async get(roomId: string) {
    const raw = await redis.get(key(roomId));
    if (!raw) return null;
    return JSON.parse(raw) as RoomState;
  },

  async join(roomId: string, playerId: string) {
    const current = await RoomStore.get(roomId);
    if (!current) return null;
    if (current.players.includes(playerId)) return current;
    const updated = { ...current, players: [...current.players, playerId] };
    await redis.set(key(roomId), JSON.stringify(updated), 'EX', ROOM_TTL_SECONDS);
    return updated;
  },

  async remove(roomId: string) {
    await redis.del(key(roomId));
  },
};
