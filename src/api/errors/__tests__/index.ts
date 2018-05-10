import { InvalidAddressError, NoDataAddressError, ApiError } from '..';

describe('errors', () => {
  describe('InvalidAddressError', () => {
    it('throw default message', () => {
      const err = new InvalidAddressError();
      expect(err.message).toMatchSnapshot();
    });
  });

  describe('NoDataAddressError', () => {
    it('throw default message', () => {
      const err = new NoDataAddressError();
      expect(err.message).toMatchSnapshot();
    });
  });

  describe('ApiError', () => {
    it('throw default message', () => {
      const err = new ApiError();
      expect(err.message).toMatchSnapshot();
    });
  });
});
