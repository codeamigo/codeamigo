declare namespace NodeJS {
  export interface ProcessEnv {
    CORS_ORIGIN: string;
    DATABASE_URL: string;
    REDIS_URL: string;
    PORT: string;
    SESSION_SECRET: string;
  }
}
