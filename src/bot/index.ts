import { Context } from '../types/bottender';
import { defaultMessage } from './commands/default';
import { start } from './commands/start';
import { help } from './commands/help';
import { add } from './commands/add';
import { remove } from './commands/remove';
import { payouts } from './commands/payouts';
import { stats } from './commands/stats';
import { about } from './commands/about';

export const handler = async (context: Context) => {
  if (context.event.isText) {
    const { text } = context.event.message;
    if (/^\/add/.test(text)) {
      await add(context);
    } else if (/^\/remove/.test(text)) {
      await remove(context);
    } else if (text === '/start') {
      await start(context);
    } else if (text === '/stats') {
      await stats(context);
    } else if (text === '/payouts') {
      await payouts(context);
    } else if (text === '/help') {
      await help(context);
    } else if (text === '/about') {
      await about(context);
    } else {
      await defaultMessage(context);
    }
  }
};
