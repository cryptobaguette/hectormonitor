import { Context } from '../../types/bottender';
import { Coins, Pools } from '../../types/types';
import { getPoolApi } from '../../api';
import { UserModel, AddressModel } from '../../models';

const isValidCoin = (coin: string) => {
  return Object.values(Coins).includes(coin);
};

const isValidPool = (pool: string) => {
  return Object.values(Pools).includes(pool);
};

export const add = async (context: Context) => {
  const { text } = context.event.message;
  const [, coin, pool, address] = text.split(' ');

  if (coin && pool && address) {
    if (!isValidCoin(coin)) {
      await context.sendText(`Invalid coin`);
      return;
    }
    if (!isValidPool(pool)) {
      await context.sendText(`Invalid pool`);
      return;
    }
    const poolApi = getPoolApi(pool as Pools);
    if (!poolApi.isCoinSupported(coin as Coins)) {
      await context.sendText(`This coin is not suppoorted on the pool`);
      return;
    }
    if (!(await poolApi.isAdressValid(coin as Coins, address))) {
      await context.sendText(`Invalid address`);
      return;
    }

    const telegramUserId = context.event.message.from.id;

    // Check user exist or create a new one
    let user = await UserModel.findOne({
      telegramUserId,
    }).exec();
    if (!user) {
      user = new UserModel({
        telegramUserId,
      });
      await user.save();
    }

    // Check address already registered
    const existingAddress = await AddressModel.findOne({
      address,
      userId: user.id,
    }).exec();
    // Adress already exist for user so return
    if (existingAddress) {
      await context.sendText(
        'This address is already registered, please choose another one'
      );
      return;
    }

    // TODO limit to three addresses per user
    const newAddress = new AddressModel({
      userId: user.id,
      address,
      coin,
      pool,
    });

    // Save last payout if there is one and pool support it
    if (poolApi.getLastPayout) {
      const lastPayout = await poolApi.getLastPayout(coin as Coins, address);
      if (lastPayout) {
        newAddress.lastPayoutId = lastPayout.txHash;
      }
    }

    await newAddress.save();

    await context.sendText(`
Thanks, you're all set. Enjoy ! 🚀
      `);
  } else {
    await context.sendText(
      `
⚠️ *Invalid arguments*
-----------------
/start <coin name> <pool name> <address>
-----------------
Valid coins: ${Object.keys(Coins).join(' ')}
Valid pools: ${Object.keys(Pools).join(' ')}
_Example: "/start eth ethermine 0x00000000...\"_
    `,
      { parse_mode: 'Markdown' }
    );
  }
};
