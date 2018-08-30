import { Context } from '../../types/bottender';

export const help = async (context: Context) => {
  await context.sendText(
    `
Don't worry, I'm here for you. 
Relax and take a deep breath. 🍻

Here's how you can control me :

/start <coin> <pool> <address> - add a new address to your account 🏠
/remove <address> - remove an address from yor account 🗑️
/stats - get your current stats 🔎
/payouts - get last payouts

/help - ask me again ! 🤖

If you need some help you can join the telegram group: https://t.me/joinchat/G3tGHlDeYYfP8WKZoMJnqw.
  `,
    {
      disable_web_page_preview: true,
    }
  );
};
