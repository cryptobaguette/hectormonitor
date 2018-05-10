import { Context } from '../../types/bottender';
import { UserModel, AddressModel } from '../../models';

export const remove = async (context: Context) => {
  const { text } = context.event.message;
  const [, address] = text.split(' ');
  if (address) {
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
    const userAddress = await AddressModel.findOne({
      address,
    }).exec();
    if (!userAddress) {
      await context.sendText('Address not found');
      return;
    }
    await userAddress.remove();
    await context.sendText(`Address removed ! 🚀`);
  } else {
    await context.sendText(
      `
⚠️ *Invalid arguments*
-----------------
/remove <address>
-----------------
_Example: "/remove 0x00000000...\"_
    `,
      { parse_mode: 'Markdown' }
    );
  }
};
