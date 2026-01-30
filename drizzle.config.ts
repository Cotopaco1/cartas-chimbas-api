import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  // 1. Dónde está tu esquema
  schema: './src/db/schema.ts',
  
  // 2. Dónde guardar las migraciones
  out: './drizzle',
  
  // 3. CAMBIO CLAVE: Usamos 'dialect' en lugar de 'driver'
  dialect: 'sqlite', 
  
  // 4. Credenciales (para SQLite local solo necesitas la URL/path)
  dbCredentials: {
    url: './game.db', // Asegúrate de que coincida con la ruta en tu src/db/index.ts
  },
  
  // Opcional: Prefijo para que sea más verbose en consola
  verbose: true,
  strict: true,
});