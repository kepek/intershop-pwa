import { CamfilOrderData } from './camfil-order.interface';
import { CamfilOrderMapper } from './camfil-order.mapper';

describe('Camfil Order Mapper', () => {
  const orderBaseData = {
    contactPerson: 'string',
    currency: 'string',
    customerName: 'string',
    customerNo: 'string',
    customerOrderNumber: 'string',
    deliveryDate: 1123123,
    camfilNo: 'string',
    ishOrderUUID: 'string',
    orderChannel: 'string',
    orderComment: 'string',
    orderDate: 'string',
    orderGoodsMark: 'string',
    orderStatus: 'string',
    orderNumber: 'string',
    deliveryAddressName: 'string',
    deliveryAddressName2: 'string',
    deliveryAddressAddress: 'string',
    deliveryAddressZipCode: 'string',
    deliveryAddressCity: 'string',
    phoneNotification: 'string',
    taxAmount: 1,
    totalCustomerPriceSum: 1,
    totalDeliveredQty: 1,
    totalOrderedQty: 1,
    totalPriceAfterDiscountExVAT: 1,
    volumeDiscount: 1,
  } as CamfilOrderData;

  describe('fromData', () => {
    it(`should return Order when getting OrderData`, () => {
      const order = CamfilOrderMapper.fromData(orderBaseData);

      expect(order).toBeTruthy();
      expect(order.id).toEqual(orderBaseData.id);
      expect(order.orderNumber).toEqual(orderBaseData.orderNumber);
      expect(order.orderStatus).toEqual(orderBaseData.orderStatus);
      expect(order.customerOrderNumber).toEqual(orderBaseData.customerOrderNumber);
      expect(order.orderGoodsMark).toEqual(orderBaseData.orderGoodsMark);
    });
  });
});
