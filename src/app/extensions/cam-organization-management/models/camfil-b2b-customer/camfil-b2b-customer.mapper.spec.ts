import { CamfilB2bCustomerData } from './camfil-b2b-customer.interface';
import { CamfilB2bCustomerMapper } from './camfil-b2b-customer.mapper';

describe('Camfil B2b Customer Mapper', () => {
  describe('fromData', () => {
    it('should throw when input is falsy', () => {
      expect(() => CamfilB2bCustomerMapper.fromData(undefined)).toThrow();
    });

    xit('should map incoming data to model data', () => {
      const data = {
        id: 'test',
      } as CamfilB2bCustomerData;
      const mapped = CamfilB2bCustomerMapper.fromData(data);
      expect(mapped).toHaveProperty('id', 'test');
      expect(mapped).not.toHaveProperty('otherField');
    });
  });
});
