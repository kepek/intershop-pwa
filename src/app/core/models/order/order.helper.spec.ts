import { OrderHelper } from './order.helper';

describe('Order Helper', () => {
  let orderStatus: string;
  beforeEach(() => {
    orderStatus = 'Created';
  });

  describe('getOrderStatusText()', () => {
    it('should return trasnlated orders status', () => {
      expect(OrderHelper.getOrderStatusText(orderStatus)).toBeTruthy();
    });
  });
});
