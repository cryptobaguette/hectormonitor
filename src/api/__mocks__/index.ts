const poolApi = {
  coins: [],
  isCoinSupported: jest.fn(() => true),
  isAdressValid: jest.fn(() => Promise.resolve(true)),
};

export const getPoolApi = jest.fn(() => poolApi);
