import { AgendaModel } from '../models';

export const cleanAgendaTable = async () => {
  await AgendaModel.remove({
    type: 'normal',
    failCount: { $exists: false },
  }).exec();
};
