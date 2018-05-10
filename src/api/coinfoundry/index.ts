import { sum } from 'lodash';
import { Coins } from '../../types/types';
import { logger } from '../../logger';
import { ApiError } from '../errors';
import { PoolApi, fetch, PoolStats } from '../utils';

interface CoinfoundryStatsWorkers {
  hashrate: number;
  sharesPerSecond: number;
}

interface CoinfoundryStats {
  pendingBalance: number;
  performance: {
    created: string;
    workers: {
      [name: string]: CoinfoundryStatsWorkers;
    };
  };
}

export class Coinfoundry implements PoolApi {
  public apiUrl = 'https://coinfoundry.org/api';
  public coins: Coins[] = [
    Coins.eth,
    Coins.etc,
    Coins.xmr,
    Coins.ltc,
    Coins.dash,
  ];

  public isCoinSupported(coin: Coins) {
    return this.coins.includes(coin);
  }

  public async isAdressValid(coin: Coins, address: string): Promise<boolean> {
    const stats: CoinfoundryStats = await this.fetch(
      `/pool/${this.convertCoinKey(coin)}/account/${address}?perfMode=day`
    );
    if (!stats.performance) {
      return false;
    }
    return true;
  }

  public async getStats(coin: Coins, address: string): Promise<PoolStats> {
    const stats: CoinfoundryStats = await this.fetch(
      `/pool/${this.convertCoinKey(coin)}/account/${address}?perfMode=day`
    );
    return this.normalizeStats(stats);
  }

  private normalizeStats(stats: CoinfoundryStats): PoolStats {
    // Need to sum all workers hashrate
    const currentHashrate = sum(
      Object.keys(stats.performance.workers).map(
        (key: string) => stats.performance.workers[key].hashrate
      )
    );

    return {
      currentHashrate,
      unpaid: stats.pendingBalance || 0,
      lastSeen: new Date(`${stats.performance.created}z`).getTime(),
      activeWorkers: Object.keys(stats.performance.workers).length,
    };
  }

  private async fetch(endpoint: string): Promise<any> {
    const res = await fetch(`${this.apiUrl}${endpoint}`);
    const { result, success } = res;
    if (!success) {
      logger.error(res);
      throw new ApiError();
    }
    return result;
  }

  private convertCoinKey(coin: Coins): string {
    return `${coin}1`;
  }
}
