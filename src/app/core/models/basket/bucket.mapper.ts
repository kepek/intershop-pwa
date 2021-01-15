import { BasketExtensions } from 'ish-core/models/basket/basket.interface';

import { Bucket, BucketData, Buckets } from './bucket.model';

export class BucketMapper {
  static fromData(payload: Buckets, lineItems: any, basketExtensions: BasketExtensions[]): Bucket[] {
    const { data, included } = payload;

    return data.map((bucketData: BucketData) => {
      const extension =
        basketExtensions && basketExtensions.find(ext => ext.shippingAddress.urn === bucketData.shipToAddress);
      const shipToAddress = bucketData.shipToAddress && included.shipToAddress[bucketData.shipToAddress];

      // todo shippingAddress => deliveryAddress

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
        shipToAddressFull: extension ? extension.shippingAddress : {},
        contactPerson: extension && extension.contactPerson,
        info: extension ? extension.info : '',
        boxLabel: extension ? extension.boxLabel : '',
        phoneNumber: extension ? extension.phoneNumber : '',
        // todo
        customer: {
          companyName: 'Bio Tech',
          companyName2: '',
          customerNo: 'BioTech',
          description: "Bio Tech is one of the world's leading companies in bio technologies.",
          id: 'xP9_AAABUmAAAAF2dzgS4.D8',
          industry: '',
        },
        nextDelivery: '12.10.22',
        orderMark: 'todo_ordermark',
        invoiceLabel: 'todo_invoiceLabel',
        deliveryDate: extension ? extension.deliveryDate : '',
      };
    });
  }
}
