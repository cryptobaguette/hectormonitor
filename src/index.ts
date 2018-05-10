import { TelegramBot } from 'bottender';
import { createServer } from 'bottender/express';
import * as mongoose from 'mongoose';
import * as Agendash from 'agendash';
import * as swaggerStats from 'swagger-stats';
import { handler } from './bot';
import { logger } from './logger';
import { agenda } from './agenda';
import { telegramClient } from './telegram-client';

logger.info(`App starting in ${process.env.NODE_ENV} mode`);

mongoose.connect(process.env.MONGO_URL);

const bot = new TelegramBot({
  accessToken: process.env.TELEGRAM_TOKEN,
});

bot.onEvent(handler);

/**
 * During development we need to poll to get bot updates
 */
if (process.env.NODE_ENV === 'development') {
  bot.createLongPollingRuntime();
}

const server = createServer(bot, {
  path: `/${process.env.TELEGRAM_URL_SECRET}`,
});

server.use(swaggerStats.getMiddleware());
server.use('/dash', Agendash(agenda));

const port = process.env.PORT || 3000;
server.listen(port, async () => {
  logger.info(`Server is running on port ${port}`);

  /**
   * During production we need to set the telegram webhook
   */
  if (process.env.NODE_ENV === 'production') {
    const webhookUrl = `${process.env.APP_URL}/${
      process.env.TELEGRAM_URL_SECRET
    }`;
    const { url } = await telegramClient.getWebhookInfo();
    if (url !== webhookUrl) {
      await telegramClient.setWebhook(webhookUrl);
      logger.info(`Telegram webhook set to ${webhookUrl}`);
    }
  }
});
