import { CamfilOrderDeliveryAddress } from 'camfil-pwa/models/camfil-order-delivery-address/camfil-order-delivery-address.model';
import { CamfilOrderLineItem } from 'camfil-pwa/models/camfil-order-line-item/camfil-order-line-item.model';
import { CamfilOrderTrackAndTrace } from 'camfil-pwa/models/camfil-order-track-and-trace/camfil-order-track-and-trace.model';
import { CamfilOrder } from 'camfil-pwa/models/camfil-order/camfil-order.model';

export class OrderLineMockData {
  static getOrder() {
    return {
      id: '4711',
      customerNo: 'OilCorp',
      contactPerson: 'Tony Halik',
      customerName: 'Bio Tech',
      customerOrderNumber: '123456789',
      deliveryDate: 1614074201807,
      deliveryAddress: OrderLineMockData.getAddress(),
      camfilNo: '123456789',
      ishOrderUUID: '54321',
      orderChannel: 'Channel 5',
      orderComment: 'Comment 1',
      orderDate: '23-02-2021',
      taxAmount: 20,
      orderGoodsMark: 'Goods mark',
      orderStatus: 'Confirmed',
      orderNumber: 'xdpas15ca',
      totalCustomerPriceSum: 4023,
      totalDeliveredQty: 4,
      totalOrderedQty: 6,
      totalPriceAfterDiscountExVAT: 4350,
      volumeDiscount: 1,
      trackAndTrace: OrderLineMockData.getTrackAndTrace(),
      lineItems: OrderLineMockData.getOrderLineItems(),
    } as CamfilOrder;
  }

  static getAddress() {
    return {
      deliveryAddressName: 'Tony Halik',
      deliveryAddressAddress: 'Test 5/2',
      deliveryAddressZipCode: '12-234',
      deliveryAddressCity: 'Testcity',
    } as CamfilOrderDeliveryAddress;
  }

  static getTrackAndTrace() {
    return {
      name: 'Track 1',
      id: '123sa',
      ownerId: '4711',
      linkText: 'DHL track',
      link: 'https://www.dhl.com/se-en/home/tracking.html',
    } as CamfilOrderTrackAndTrace;
  }
  static getOrderLineItems() {
    return [
      {
        articleName: 'Test article',
        boxLabel: 'test label',
        currency: 'SEK',
        deliveredQty: 4,
        deliveryDate: 1614074201807,
        id: '765',
        name: 'Article name',
        orderedQty: 4,
        ownerId: '4711',
        sku: '12345',
        totalRowCustomerPrice: 2030,
        rowNumber: 2,
        type: 'Type',
      },
    ] as CamfilOrderLineItem[];
  }
}
