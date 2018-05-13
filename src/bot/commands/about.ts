import { Context } from '../../types/bottender';

export const about = async (context: Context) => {
  await context.sendText(`
Hector monitor
-----------------
Github: https://github.com/cryptobaguette/hectormonitor
-----------------
If you like this project and want to support the development please consider making a donation to:
BTC: 13qjGdHZrUEewKR9CrxnRDoDniLQkoVg7u
ETH: 0x0D0939DD71bC2a1A0C06440703c9DB88d10DfA2C
DOGE: DQEDFN4HTMJhGpwzidW6HLy9fJVf5jFFvb
  `);
};
