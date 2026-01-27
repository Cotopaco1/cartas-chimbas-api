# Cartas chimbas api.

## ESTADO: ALPHA v1.0

## Estructura de carpetas
src/
├── config/             # Variables de entorno, DB config (Postgres/Mongo), Redis
├── controllers/        # Controladores HTTP (reciben request, llaman servicios, responden)
├── middlewares/        # Auth, validación de datos (Joi/Zod), manejo de errores
├── models/             # Esquemas de Base de Datos (ORM como Prisma, TypeORM o Mongoose)
├── routes/             # Definición de rutas de la API (v1)
├── services/           # Lógica de negocio PURA (GameLogic, RoomManager)
│   ├── AuthService.ts
│   ├── GameService.ts
│   └── SocketService.ts # Manejador de eventos de WebSocket
├── sockets/            # Controladores de eventos de Socket.io
│   ├── gameHandlers.ts
│   └── roomHandlers.ts
├── utils/              # Helpers, constantes (Logger, AppError)
├── types/              # Definiciones de tipos (Interfaces de TS)
├── app.ts              # Entry point de la app
└── server.ts           # Inicialización del servidor (HTTP + Socket.io)


## Endpoints

### Endpoints HTTP

Útiles para acciones que no requieren "tiempo real" inmediato o para la carga inicial.

#### Auth & Users

POST /api/v1/auth/register -> Crea usuario.

POST /api/v1/auth/login -> Retorna JWT.

GET /api/v1/users/profile -> Datos del jugador (stats, avatar).

#### Decks (Mazos de cartas)

GET /api/v1/decks -> Lista mazos disponibles (Base, Expansiones).

GET /api/v1/decks/:deckId -> Detalles de un mazo.

#### Rooms (Gestión de salas)

GET /api/v1/rooms -> Lista salas públicas activas.

POST /api/v1/rooms -> Crea una sala nueva (config: maxPlayers, decks, rounds).

GET /api/v1/rooms/:roomId -> Verifica si una sala existe/está llena antes de conectar el socket.

### Eventos Websocket

Esto es lo que tu cliente React Native consumirá el 90% del tiempo.

Fase 1: Sala de Espera (Lobby)

emit('join_room', { roomId, user }): El usuario entra.

on('player_joined'): Notifica a otros que entró alguien.

emit('player_ready'): Marcar "Estoy listo".

emit('start_game'): Solo el host puede enviarlo.

Fase 2: El Juego (Game Loop)

on('game_started'): El servidor reparte las manos iniciales (White Cards) a cada cliente.

on('new_round'): El servidor anuncia quién es el "Czar" (Juez) y muestra la "Black Card".

emit('submit_card', { cardId }): Jugador envía su carta blanca.

on('card_submitted'): Servidor avisa "Jugador X ya tiró" (sin mostrar la carta aún).

on('reveal_cards'): Cuando todos tiraron (o timer expiró), servidor envía todas las cartas jugadas al cliente.

emit('judge_pick', { cardId }): El Czar elige la ganadora.

on('round_winner', { userId, cardId }): Servidor anuncia ganador y actualiza puntajes.

Fase 3: Chat & Sistema

emit('send_message', { text }): Chat en la sala.

on('error_message'): Manejo de errores en tiempo real (ej: "Sala llena").

## Recomendaciones
- State Management (Redis): No guardes el estado de la partida (quién tiró qué carta, puntajes actuales) en la base de datos SQL principal si vas a tener mucho tráfico. Usa Redis para el estado volátil del juego en curso. Es mucho más rápido. Solo guarda en SQL el historial final de la partida.

- Manejo de Desconexiones: En móviles (React Native), la conexión se cae si la app pasa a segundo plano. Tu backend debe tener un mecanismo de "reconnection grace period". Si el usuario vuelve en menos de 30 segundos, recupérale el estado de su mano y la partida.

- Timeouts: En el backend, usa setTimeout o Cron jobs para forzar el fin de una ronda si un jugador se duerme y no tira carta. Nunca confíes en que el cliente enviará la acción.

