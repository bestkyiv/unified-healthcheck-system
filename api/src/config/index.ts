declare module 'bun' {
  interface Env {
    PORT: number;
    DATABASE_URL: string;
    API_TO_BOT_KEY: string;
    BOT_TO_API_KEY: string;
  }
}
