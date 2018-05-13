import { format } from 'date-fns';
import timeago from 'timeago.js';
import { Address } from '../models';
import { Coins } from '../types/types';

const coinsInfo = {
  [Coins.eth]: {
    txUrl: 'https://www.etherchain.org/tx',
  },
  [Coins.etc]: {
    txUrl: 'https://gastracker.io/tx',
  },
  [Coins.xmr]: {
    txUrl: 'https://chainradar.com/xmr/transaction',
  },
  [Coins.ltc]: {
    txUrl: 'https://live.blockcypher.com/ltc/tx',
  },
  [Coins.dash]: {
    txUrl: 'https://live.blockcypher.com/dash/tx',
  },
};

export const getAddressHeader = (address: Address): string => {
  return `🏠 *${address.coin} ${address.pool} address*: ${address.address}`;
};

export const getFormattedDate = (timestamp: number): string => {
  return format(timestamp, 'DD/MM/YYYY HH:mm');
};

export const getFormattedTimeAgo = (timestamp: number): string => {
  const timeagoInstance = timeago();
  return timeagoInstance.format(timestamp);
};

export const getFormattedPayoutTx = (coin: Coins, txHash: string): string => {
  return `[Tx ${txHash.substring(0, 10)}...](${
    coinsInfo[coin].txUrl
  }/${txHash})`;
};

export const getFormattedPayoutAmount = (
  coin: Coins,
  amount: number
): string => {
  return `${parseFloat(parseFloat(amount.toString()).toFixed(5))} ${coin}`;
};

export const getFormattedHahrate = (_: Coins, hashrate: number): string => {
  const units = ['KH/s', 'MH/s', 'GH/s', 'TH/s', 'PH/s'];
  let i = -1;
  while (hashrate > 1000 && i < units.length - 1) {
    hashrate = hashrate / 1000;
    i++;
  }
  if (i === -1) {
    i = 0;
  }
  return `${parseFloat(hashrate.toFixed(2))} ${units[i]}`;
};

export const getFormattedError = (address: Address, err: any) => {
  return `
${getAddressHeader(address)}
-----------------
*Error*:
${err.message}
  `;
};
