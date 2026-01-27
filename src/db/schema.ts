import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// Tabla de Usuarios
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  username: text('username').notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// Tabla de Salas (Rooms)
export const rooms = sqliteTable('rooms', {
  id: text('id').primaryKey(), // ID generado tipo UUID
  hostId: integer('host_id').references(() => users.id),
  status: text('status', { enum: ['waiting', 'playing', 'finished'] }).default('waiting'),
  maxPlayers: integer('max_players').default(10),
});

// Tabla de Mazos (Decks)
export const decks = sqliteTable('decks', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
});