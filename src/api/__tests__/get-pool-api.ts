import { getPoolApi } from '../get-pool-api';
import { Pools } from '../../types/types';
import { Ethermine } from '../ethermine';
import { Coinfoundry } from '../coinfoundry';

describe('getPoolApi', () => {
  it('should return ethermine instance', () => {
    const poolApi = getPoolApi(Pools.ethermine);
    expect(poolApi instanceof Ethermine).toBeTruthy();
  });

  it('should return coinfoundry instance', () => {
    const poolApi = getPoolApi(Pools.coinfoundry);
    expect(poolApi instanceof Coinfoundry).toBeTruthy();
  });
});
