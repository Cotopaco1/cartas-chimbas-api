import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';

const sqlite = new Database('game.db');

// OPTIMIZACIÓN CRÍTICA: Write-Ahead Logging
// Permite que lectores y escritores no se bloqueen mutuamente.
sqlite.pragma('journal_mode = WAL'); 

// Inicializamos Drizzle con el esquema para tener autocompletado
export const db = drizzle(sqlite, { schema });