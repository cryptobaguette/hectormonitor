import { Pools } from '../types/types';
import { PoolApi } from './utils';
import { Ethermine } from './ethermine';
import { Nanopool } from './nanopool';
import { Coinfoundry } from './coinfoundry';

const map = {
  [Pools.ethermine]: new Ethermine(),
  [Pools.nanopool]: new Nanopool(),
  [Pools.coinfoundry]: new Coinfoundry(),
};

export const getPoolApi = (pool: Pools): PoolApi => {
  return map[pool];
};
