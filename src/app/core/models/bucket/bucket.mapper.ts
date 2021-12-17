import { BasketExtensionData } from 'ish-core/models/basket-extension/basket-extension.interface';
import { BucketData, BucketsData } from 'ish-core/models/bucket/bucket.interface';
import { LineItemView } from 'ish-core/models/line-item/line-item.model';
import { PriceItemMapper } from 'ish-core/models/price-item/price-item.mapper';
import { PriceMapper } from 'ish-core/models/price/price.mapper';

import { Bucket } from './bucket.model';

export class BucketMapper {
  static fromData(payload: BucketsData, lineItems: LineItemView[], basketExtensions: BasketExtensionData[]): Bucket[] {
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
          .filter(element => !!element)
          .sort((a, b) => (a.position < b.position ? -1 : 1)),
        shippingMethod: bucketData.shippingMethod,
        surcharges: bucketData.surcharges
          ? bucketData.surcharges.map(surcharge => ({
              amount: PriceItemMapper.fromPriceItem(surcharge.amount),
              description: surcharge.description,
              displayName: surcharge.name,
              taxes: surcharge?.taxes?.map(PriceMapper.fromData),
            }))
          : undefined,
        deliveryAddressId: shipToAddress ? shipToAddress.id : '',
        shipToAddress: extension ? extension.shippingAddress.urn : '',
        shipToAddressFull: extension ? extension.shippingAddress : undefined,
        contactPerson: extension && extension.contactPerson,
        createdFromCamCardId: extension?.createdFromCamCardId || '',
        info: extension ? extension.info : '',
        phoneNumber: extension ? extension.phoneNumber : '',
        customer: extension ? extension.customer : undefined,
        orderMark: extension ? extension.orderMark : '',
        invoiceLabel: extension ? extension.invoiceLabel : '',
        deliveryDate: extension ? extension.deliveryDate : '',
        volumeDiscount: extension ? extension.volumeDiscount : 0,
      };
    });
  }
}
