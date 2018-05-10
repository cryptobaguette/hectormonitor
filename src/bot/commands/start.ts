import { Context } from '../../types/bottender';

export const start = async (context: Context) => {
  await context.sendText(`
Hi there !

Looks like it's your first time 🤘
Don't worry, it's easy :

To register a new address use the /add command ⛏
  `);
};
