declare namespace NodeJS {
  interface ProcessEnv {
    REDIS_URL?: string;
    REDIS_HOST?: string;
    REDIS_PORT?: string;
    REDIS_USERNAME?: string;
    REDIS_PASSWORD?: string;
    REDIS_DB?: string;
    ROOM_TTL_SECONDS?: string;
  }
}
