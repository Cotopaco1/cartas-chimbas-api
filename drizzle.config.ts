import type { Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema.ts', // Donde definiste tus tablas
  out: './drizzle',             // Donde guardará los archivos .sql
  driver: 'better-sqlite',
  dbCredentials: {
    url: 'game.db',
  },
} satisfies Config;