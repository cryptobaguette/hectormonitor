import { Context } from '../../types/bottender';

export const defaultMessage = async (context: Context) => {
  await context.sendText(`
Hmm... I'm sorry, I didn't get that. Are you drunk or are you lost ? 🤔
- If you're drunk, dude, get out of here ! 🤤
- If you're lost, type /help and I'll do my best. 🤖
  `);
};
