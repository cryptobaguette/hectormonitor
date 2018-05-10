import { AddressModel, UserModel } from '../models';
import { getPoolApi } from '../api';
import { telegramClient } from '../telegram-client';
import {
  getAddressHeader,
  getFormattedPayoutAmount,
  getFormattedPayoutTx,
  getFormattedDate,
} from '../bot/utils';

export const checkNewPayout = async (addressId: string) => {
  const address = await AddressModel.findById(addressId);
  if (!address) {
    throw new Error('Address not found');
  }
  const user = await UserModel.findById(address.userId);
  if (!user) {
    throw new Error('User not found');
  }
  const poolApi = getPoolApi(address.pool);
  if (poolApi.getLastPayout) {
    const lastPayout = await poolApi.getLastPayout(
      address.coin,
      address.address
    );
    if (lastPayout && lastPayout.txHash !== address.lastPayoutId) {
      address.lastPayoutId = lastPayout.txHash;
      await address.save();
      const formattedDate = getFormattedDate(lastPayout.paidOn);
      const formattedAmout = getFormattedPayoutAmount(
        address.coin,
        lastPayout.amount
      );
      const formattedTx = getFormattedPayoutTx(address.coin, lastPayout.txHash);
      await telegramClient.sendMessage(
        user.telegramUserId,
        `
💸 *New payout from ${address.pool}*
-----------------
${getAddressHeader(address)}
-----------------
💰 *Payout*
${formattedDate}: *${formattedAmout}* ${formattedTx}
      `,
        {
          parse_mode: 'Markdown',
          disable_web_page_preview: true,
        }
      );
    }
  }
};
