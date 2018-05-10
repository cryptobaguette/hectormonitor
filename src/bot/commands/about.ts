import { Context } from '../../types/bottender';

export const about = async (context: Context) => {
  await context.sendText(`
Hector monitor
-----------------
Github: https://github.com/cryptobaguette/hectormonitor
-----------------
If you like this project and want to support the development please consider making a donation to:
BTC: 13qjGdHZrUEewKR9CrxnRDoDniLQkoVg7u
ETH: 0xE269Bad174c4116c31719463b6e8DD2AF8413610
DOGE: DQEDFN4HTMJhGpwzidW6HLy9fJVf5jFFvb
  `);
};
