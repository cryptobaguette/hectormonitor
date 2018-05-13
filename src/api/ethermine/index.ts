import * as ethunits from 'ethereum-units';
import { InvalidAddressError, NoDataAddressError, ApiError } from '../errors';
import { Coins } from '../../types/types';
import { logger } from '../../logger';
import { PoolApi, PoolPayout, fetch, PoolStats } from '../utils';

export class Ethermine implements PoolApi {
  public apiUrl: {
    [key: string]: string;
  } = {
    [Coins.eth]: 'https://api.ethermine.org',
    [Coins.etc]: 'https://api-etc.ethermine.org',
  };
  public coins: Coins[] = [Coins.eth, Coins.etc];

  public isCoinSupported(coin: Coins) {
    return this.coins.includes(coin);
  }

  public async isAdressValid(coin: Coins, address: string): Promise<boolean> {
    try {
      await this.fetch(coin, `/miner/${address}/currentStats`);
    } catch (err) {
      if (err instanceof NoDataAddressError) {
        return false;
      }
      throw err;
    }
    return true;
  }

  public async getLastPayout(
    coin: Coins,
    address: string
  ): Promise<PoolPayout | null> {
    const payouts: any[] = await this.fetch(coin, `/miner/${address}/payouts`);
    return payouts && payouts.length > 0
      ? this.normalizePayout(payouts[0])
      : null;
  }

  public async getPayouts(coin: Coins, address: string): Promise<PoolPayout[]> {
    const payouts: any[] = await this.fetch(coin, `/miner/${address}/payouts`);
    return payouts.map(this.normalizePayout);
  }

  public async getStats(coin: Coins, address: string): Promise<PoolStats> {
    const stats = await this.fetch(coin, `/miner/${address}/currentStats`);
    return this.normalizeStats(stats);
  }

  private normalizePayout(payout: PoolPayout): PoolPayout {
    return {
      txHash: payout.txHash,
      amount: Number(ethunits.convert(payout.amount, 'wei', 'ether')),
      paidOn: payout.paidOn * 1000,
    };
  }

  private normalizeStats(stats: PoolStats): PoolStats {
    return {
      reportedHashrate: stats.reportedHashrate,
      currentHashrate: stats.currentHashrate || 0,
      averageHashrate: stats.averageHashrate,
      unpaid: Number(ethunits.convert(stats.unpaid || 0, 'wei', 'ether')),
      lastSeen: stats.lastSeen! * 1000,
      activeWorkers: stats.activeWorkers || 0,
    };
  }

  private async fetch(coin: Coins, endpoint: string): Promise<any> {
    const res = await fetch(`${this.apiUrl[coin]}${endpoint}`);
    const { data, status, error } = res;

    // Api return error
    if (status === 'ERROR') {
      if (error === 'Invalid address') {
        throw new InvalidAddressError();
      }
      logger.error(res);
      throw new ApiError();
    }
    // Api return no data
    if (data === 'NO DATA') {
      throw new NoDataAddressError();
    }

    // No data probably api not working well
    if (!data) {
      logger.error(res);
      throw new ApiError();
    }
    return data;
  }
}
