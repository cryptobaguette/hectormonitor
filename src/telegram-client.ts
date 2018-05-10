import { TelegramClient } from 'messaging-api-telegram';

export const telegramClient = TelegramClient.connect(
  process.env.TELEGRAM_TOKEN
);
