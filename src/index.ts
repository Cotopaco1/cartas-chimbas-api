import express from 'express';
import { createServer } from 'node:http'; // Módulo nativo de Node
import { Server } from 'socket.io';
import cors from 'cors';

// Importamos nuestros handlers (luego los creamos)
import { registerRoomHandlers } from './sockets/roomHandlers';
// import { registerGameHandlers } from './sockets/gameHandlers';

const app = express();
const httpServer = createServer(app); // Envolvemos Express

// Configuración de CORS (Crítico para React Native)
app.use(cors({
  origin: '*', // En producción, pon aquí tu dominio real
  methods: ['GET', 'POST']
}));

app.use(express.json());

// Inicializamos Socket.io sobre el servidor HTTP
const io = new Server(httpServer, {
  cors: {
    origin: '*', // Permitir conexiones desde cualquier IP (necesario para móviles en dev)
  }
});

// Middleware de Socket.io (opcional: Auth)
io.use((socket, next) => {
  // Aquí validaríamos el token JWT del usuario antes de dejarlo conectar
  // const token = socket.handshake.auth.token;
  console.log(`Intento de conexión: ${socket.id}`);
  next();
});

// Manejo de conexiones
io.on('connection', (socket) => {
  console.log(`Usuario conectado: ${socket.id}`);

  // PATRÓN DE DISEÑO: Separación de Handlers
  // Pasamos 'io' y 'socket' a funciones externas para no tener un archivo gigante
  registerRoomHandlers(io, socket);
//   registerGameHandlers(io, socket);

  socket.on('disconnect', () => {
    console.log(`Usuario desconectado: ${socket.id}`);
  });
});

// Rutas REST básicas de prueba
app.get('/health', (req, res) => {
  res.json({ status: 'ok', db: 'connected' });
});

// Levantar el servidor
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});