declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: 'production' | 'development' | 'test';
    TELEGRAM_TOKEN: string;
    MONGO_URL: string;
    APP_URL: string;
    TELEGRAM_URL_SECRET: string;
  }

  export interface Process {
    env: ProcessEnv;
  }
}
