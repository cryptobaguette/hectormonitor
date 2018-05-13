import { sum } from 'lodash';
import { Context } from '../../types/bottender';
import { AddressModel, UserModel } from '../../models';
import { getPoolApi } from '../../api';
import {
  getAddressHeader,
  getFormattedPayoutTx,
  getFormattedPayoutAmount,
  getFormattedDate,
} from '../utils';

export const payouts = async (context: Context) => {
  const telegramUserId = context.event.message.from.id;
  const user = await UserModel.findOne({
    telegramUserId,
  }).exec();
  if (!user) {
    await context.sendText(`
You don't have any address attached to your account yet.
You can setup one with /start.
    `);
    return;
  }
  const addresses = await AddressModel.find({
    userId: user.id,
  }).exec();
  if (addresses.length === 0) {
    await context.sendText('No address found');
    return;
  }

  for (const address of addresses) {
    const poolApi = getPoolApi(address.pool);
    if (poolApi.getPayouts) {
      let userPayouts = await poolApi.getPayouts(address.coin, address.address);
      // Limit to last 20
      userPayouts = userPayouts.slice(0, 20);
      const totalFormattedAmount = getFormattedPayoutAmount(
        address.coin,
        sum(userPayouts.map(payout => payout.amount))
      );
      let reply = `
${getAddressHeader(address)}
-----------------
💸 *Total*:
*${totalFormattedAmount}* (last ${userPayouts.length} payouts)
-----------------
💰 *Last payouts*:
`;
      userPayouts.forEach(payout => {
        const formattedDate = getFormattedDate(payout.paidOn);
        const formattedTx = getFormattedPayoutTx(address.coin, payout.txHash);
        const formattedAmount = getFormattedPayoutAmount(
          address.coin,
          payout.amount
        );
        reply += `${formattedDate}: *${formattedAmount}* ${formattedTx}\n`;
      });
      await context.sendText(reply, {
        parse_mode: 'Markdown',
        disable_web_page_preview: true,
      });
    }
  }
};
