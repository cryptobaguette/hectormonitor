import { Coins } from '../../types/types';
import { PoolApi, fetch, PoolStats, PoolPayout } from '../utils';
import { ApiError } from '../errors';
import { logger } from '../../logger';

interface NanopoolPayout {
  date: number;
  txHash: string;
  amount: number;
  confirmed: boolean;
}

interface NanopoolUser {
  balance: number;
  hashrate: number;
  workers: any[];
  avgHashrate: {
    h24: number;
  };
}

export class Nanopool implements PoolApi {
  public apiUrl = 'https://api.nanopool.org/v1';
  public coins: Coins[] = [Coins.eth, Coins.etc, Coins.xmr];

  public isCoinSupported(coin: Coins) {
    return this.coins.includes(coin);
  }

  public async isAdressValid(coin: Coins, address: string): Promise<boolean> {
    try {
      const res = await this.fetch(coin, `/accountexist/${address}`);
      if (res === 'Account exist') {
        return true;
      }
    } catch (err) {
      if (err === 'Account not found') {
        return false;
      }
    }
    return false;
  }

  public async getStats(coin: Coins, address: string): Promise<PoolStats> {
    const user = await this.fetch(coin, `/user/${address}`);
    return this.normalizeStats(user);
  }

  public async getLastPayout(
    coin: Coins,
    address: string
  ): Promise<PoolPayout | null> {
    const payouts: any[] = await this.fetch(coin, `/payments/${address}`);
    return payouts && payouts.length > 0
      ? this.normalizePayout(payouts[0])
      : null;
  }

  public async getPayouts(coin: Coins, address: string): Promise<PoolPayout[]> {
    const payouts: any[] = await this.fetch(coin, `/payments/${address}`);
    return payouts.map(this.normalizePayout);
  }

  private normalizePayout(payout: NanopoolPayout): PoolPayout {
    return {
      txHash: payout.txHash,
      amount: payout.amount,
      paidOn: payout.date * 1000,
    };
  }

  private normalizeStats(stats: NanopoolUser): PoolStats {
    return {
      currentHashrate: Number(stats.hashrate) || 0,
      averageHashrate: Number(stats.avgHashrate.h24) || 0,
      unpaid: Number(stats.balance),
      activeWorkers: stats.workers.length || 0,
    };
  }

  private async fetch(coin: Coins, endpoint: string): Promise<any> {
    const res = await fetch(`${this.apiUrl}/${coin}${endpoint}`);
    const { data, error } = res;
    if (error) {
      logger.error(res);
      throw new ApiError(error);
    }
    return data;
  }
}
