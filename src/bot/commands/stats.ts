import { Context } from '../../types/bottender';
import { UserModel, AddressModel } from '../../models';
import { getPoolApi } from '../../api';
import {
  getAddressHeader,
  getFormattedTimeAgo,
  getFormattedPayoutAmount,
  getFormattedHahrate,
  getFormattedError,
} from '../utils';

export const stats = async (context: Context) => {
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
    try {
      const poolApi = getPoolApi(address.pool);
      const userStats = await poolApi.getStats(address.coin, address.address);

      const formattedTimeAgo = userStats.lastSeen
        ? getFormattedTimeAgo(userStats.lastSeen)
        : null;
      const formattedUnpaid = getFormattedPayoutAmount(
        address.coin,
        userStats.unpaid
      );
      const formattedCurrentHashrate = getFormattedHahrate(
        address.coin,
        userStats.currentHashrate
      );
      const formattedReportedHashrate = userStats.reportedHashrate
        ? getFormattedHahrate(address.coin, userStats.reportedHashrate)
        : null;
      const formattedAverageHashrate = userStats.averageHashrate
        ? getFormattedHahrate(address.coin, userStats.averageHashrate)
        : null;

      let reply = `
${getAddressHeader(address)}
-----------------
🔎 *Status*:
`;
      if (formattedReportedHashrate) {
        reply += `Reported miner Hashrate: *${formattedReportedHashrate}*\n`;
      }
      reply += `Pool Current Hashrate: *${formattedCurrentHashrate}*\n`;
      if (formattedAverageHashrate) {
        reply += `Pool Average Hashrate: *${formattedAverageHashrate}* (last 24h)\n`;
      }
      reply += `Unpaid balance: *${formattedUnpaid}*\n`;
      if (formattedTimeAgo) {
        reply += `Last seen: ${formattedTimeAgo}\n`;
      }
      reply += `Current active workers: ${userStats.activeWorkers}`;

      await context.sendText(reply, { parse_mode: 'Markdown' });
    } catch (err) {
      const errorMessage = getFormattedError(address, err);
      await context.sendText(errorMessage, { parse_mode: 'Markdown' });
    }
  }
};
