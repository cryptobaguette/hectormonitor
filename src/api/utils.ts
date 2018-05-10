import axios from 'axios';
import { Coins } from '../types/types';
import { ApiError } from './errors';
import { logger } from '../logger';

export interface PoolApi {
  /**
   * Does the pool allow mining of that coin
   */
  isCoinSupported(coin: Coins): boolean;
  /**
   * Is the address active on the pool
   */
  isAdressValid(coin: Coins, address: string): Promise<boolean>;
  /**
   * Get the stats on the pool
   */
  getStats(coin: Coins, address: string): Promise<PoolStats>;
  /**
   * Get the latest payout on the pool
   */
  getLastPayout?(coin: Coins, address: string): Promise<PoolPayout | null>;
  /**
   * Get the latest payouts on the pool
   */
  getPayouts?(coin: Coins, address: string): Promise<PoolPayout[]>;
}

export interface PoolPayout {
  amount: number;
  txHash: string;
  paidOn: number;
}

export interface PoolStats {
  reportedHashrate?: number;
  averageHashrate?: number;
  currentHashrate: number;
  unpaid: number;
  lastSeen: number;
  activeWorkers: number;
}

export const fetch = async (endpoint: string): Promise<any> => {
  try {
    const res = await axios.get(endpoint);
    return res.data;
  } catch (err) {
    logger.error(err);
    throw new ApiError();
  }
};
