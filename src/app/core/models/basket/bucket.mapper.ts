import { BasketExtensions } from 'ish-core/models/basket/basket.interface';

import { Bucket, BucketData, Buckets } from './bucket.model';

export class BucketMapper {
  static fromData(payload: Buckets, lineItems: any, basketExtensions: BasketExtensions[]): Bucket[] {
    const { data, included } = payload;

    return data.map((bucketData: BucketData) => {
      const extension =
        basketExtensions && basketExtensions.find(ext => ext.shippingAddress.urn === bucketData.shipToAddress);
      const shipToAddress = bucketData.shipToAddress && included.shipToAddress[bucketData.shipToAddress];

      return {
        ...bucketData,
        id: bucketData.id,
        basket: bucketData.basket,
        lineItems: bucketData.lineItems
          .map(id => lineItems.find(element => element.id === id))
          .filter(element => !!element),
        shippingMethod: bucketData.shippingMethod,
        deliveryAddressId: shipToAddress ? shipToAddress.id : '',
        shipToAddress: extension ? extension.shippingAddress.urn : '',
        shipToAddressFull: extension ? extension.shippingAddress : undefined,
        contactPerson: extension && extension.contactPerson,
        info: extension ? extension.info : '',
        boxLabel: extension ? extension.boxLabel : '',
        phoneNumber: extension ? extension.phoneNumber : '',
        customer: extension ? extension.customer : undefined,
        orderMark: extension ? extension.orderMark : '',
        invoiceLabel: extension ? extension.invoiceLabel : '',
        deliveryDate: extension ? extension.deliveryDate : '',
      };
    });
  }
}
