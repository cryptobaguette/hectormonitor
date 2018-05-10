import * as Agenda from 'agenda';
import { checkNewPayout, cleanAgendaTable, checkMinerDown } from './cron';
import { AddressModel } from './models/address';

export const agenda = new Agenda({ db: { address: process.env.MONGO_URL } });

agenda.define('check miners down', async (job, done) => {
  try {
    await checkMinerDown(job.attrs.data.addressId);
    done();
  } catch (err) {
    done(err);
  }
});

agenda.define('check miners down trigger', async (_, done) => {
  try {
    const addresses = await AddressModel.find({}).exec();
    for (const address of addresses) {
      agenda.now('check miners down', { addressId: address.id });
    }
    done();
  } catch (err) {
    done(err);
  }
});

agenda.define('check new payouts', async (job, done) => {
  try {
    await checkNewPayout(job.attrs.data.addressId);
    done();
  } catch (err) {
    done(err);
  }
});

agenda.define('check new payouts trigger', async (_, done) => {
  try {
    const addresses = await AddressModel.find({}).exec();
    for (const address of addresses) {
      agenda.now('check new payouts', { addressId: address.id });
    }
    done();
  } catch (err) {
    done(err);
  }
});

agenda.define('clean agenda table', async (_, done) => {
  try {
    await cleanAgendaTable();
    done();
  } catch (err) {
    done(err);
  }
});

agenda.on('ready', async () => {
  agenda.every('*/30 * * * *', 'check miners down trigger');
  agenda.every('*/30 * * * *', 'check new payouts trigger');
  agenda.every('0 0 * * *', 'clean agenda table');

  agenda.start();
});
