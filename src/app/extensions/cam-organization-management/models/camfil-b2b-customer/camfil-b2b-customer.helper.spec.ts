import { CamfilB2bCustomerHelper } from './camfil-b2b-customer.helper';
import { CamfilB2bCustomer } from './camfil-b2b-customer.model';

describe('Camfil B2b Customer Helper', () => {
  describe('equal', () => {
    it.each([
      [false, undefined, undefined],
      [false, { id: 'test' } as CamfilB2bCustomer, undefined],
      [false, undefined, { id: 'test' } as CamfilB2bCustomer],
      [false, { id: 'test' } as CamfilB2bCustomer, { id: 'other' } as CamfilB2bCustomer],
      [true, { id: 'test' } as CamfilB2bCustomer, { id: 'test' } as CamfilB2bCustomer],
    ])(`should return %s when comparing %j and %j`, (expected, o1, o2) => {
      expect(CamfilB2bCustomerHelper.equal(o1, o2)).toEqual(expected);
    });
  });
});
