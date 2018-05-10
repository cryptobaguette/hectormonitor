import { AddressModel, UserModel } from '../models';
import { getPoolApi } from '../api';
import { telegramClient } from '../telegram-client';
import { getAddressHeader } from '../bot/utils';

export const checkMinerDown = async (addressId: string) => {
  const address = await AddressModel.findById(addressId);
  if (!address) {
    throw new Error('Address not found');
  }
  const user = await UserModel.findById(address.userId);
  if (!user) {
    throw new Error('User not found');
  }

  const poolApi = getPoolApi(address.pool);
  const stats = await poolApi.getStats(address.coin, address.address);
  let error;
  if (stats.currentHashrate === 0) {
    error = `Your reported hashrate is 0`;
  } else if (stats.activeWorkers === 0) {
    error = `You have 0 active workers`;
  }
  if (error) {
    await telegramClient.sendMessage(
      user.telegramUserId,
      `
⚠️ *Alert*
-----------------
${getAddressHeader(address)}
-----------------
Your miner is probably offline 😵
${error}
    `,
      {
        parse_mode: 'Markdown',
      }
    );
  }
};
