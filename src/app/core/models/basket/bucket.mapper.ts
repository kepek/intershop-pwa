import { BasketExtensions } from 'ish-core/models/basket/basket.interface';

import { Bucket, BucketData, Buckets } from './bucket.model';

export class BucketMapper {
  static fromData(payload: Buckets, lineItems: any, basketExtensions: BasketExtensions[]): Bucket[] {
    const { data, included } = payload;

    return data.map((bucketData: BucketData) => {
      const extension =
        basketExtensions && basketExtensions.find(ext => ext.shippingAddress.urn === bucketData.shipToAddress);

      return {
        ...bucketData,
        id: bucketData.id,
        basket: bucketData.basket,
        lineItems: bucketData.lineItems
          .map(id => lineItems.find(element => element.id === id))
          .filter(element => !!element),
        deliveryAddressId: bucketData.shipToAddress ? included.shipToAddress[bucketData.shipToAddress].id : '',
        transient: false,
        contactPersonId: extension && extension.contactPerson ? extension.contactPerson.erpId : '',
        info: extension ? extension.info : '',
        boxLabel: extension ? extension.boxLabel : '',
        phoneNumber: extension ? extension.phoneNumber : '',
      };
    });
  }
}
