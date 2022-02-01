import { AddressData } from 'ish-core/models/address/address.interface';
import { AddressMapper } from 'ish-core/models/address/address.mapper';
import { BasketExtension } from 'ish-core/models/basket-extension/basket-extension.model';
import { BasketSurchargeMapper } from 'ish-core/models/basket-surcharge/basket-surcharge.mapper';
import { BasketView } from 'ish-core/models/basket/basket.model';
import { BucketTotal } from 'ish-core/models/bucket-total/bucket-total.model';
import { BucketBaseData, BucketData } from 'ish-core/models/bucket/bucket.interface';
import { LineItem, LineItemView } from 'ish-core/models/line-item/line-item.model';
import { PriceItemHelper } from 'ish-core/models/price-item/price-item.helper';
import { PriceItemMapper } from 'ish-core/models/price-item/price-item.mapper';
import { PriceItem } from 'ish-core/models/price-item/price-item.model';
import { Price } from 'ish-core/models/price/price.model';

import { Bucket } from './bucket.model';

export class BucketMapper {
  static fromListData(payload: BucketData, basket: BasketView): Bucket[] {
    const { data, included } = payload;

    return data.map((bucketData: BucketBaseData) => {
      const shipToAddress = bucketData?.shipToAddress && included?.shipToAddress[bucketData?.shipToAddress];
      return BucketMapper.fromData(bucketData, basket, shipToAddress);
    });
  }

  static fromData(bucketData: BucketBaseData, basket: BasketView, shipToAddressData: AddressData): Bucket {
    const extension = BucketMapper.getExtension(bucketData, basket);
    const shipToAddress = AddressMapper.fromData(shipToAddressData);
    const lineItems = BucketMapper.getLineItems(bucketData, basket);
    const totals = BucketMapper.getTotals(bucketData, basket);

    return {
      ...bucketData,
      id: bucketData.id,
      basket: bucketData.basket,
      shippingMethod: bucketData.shippingMethod,
      deliveryAddressId: shipToAddress?.id || '',
      shipToAddress: extension?.shippingAddress.urn || '',
      shipToAddressFull: extension?.shippingAddress,
      contactPerson: extension?.contactPerson,
      createdFromCamCardId: extension?.createdFromCamCardId || '',
      info: extension?.info || '',
      phoneNumber: extension?.phoneNumber || '',
      customer: extension?.customer,
      orderMark: extension?.orderMark || '',
      invoiceLabel: extension?.invoiceLabel || '',
      deliveryDate: extension?.deliveryDate || '',
      volumeDiscount: extension?.volumeDiscount,
      purchaseCurrency: basket?.purchaseCurrency,
      lineItems,
      totals,
    };
  }

  static getExtension(bucketData: BucketBaseData, basket: BasketView): BasketExtension {
    return basket?.basketExtensions?.find(ext => ext?.shippingAddress?.urn === bucketData?.shipToAddress);
  }

  static getLineItems(bucketData: BucketBaseData, basket: BasketView): LineItemView[] {
    return bucketData.lineItems
      .map(id => basket?.lineItems.find(element => element.id === id))
      .filter(element => !!element)
      .sort((a, b) => (a.position < b.position ? -1 : 1));
  }

  static getTotals(bucketData: BucketBaseData, basket: BasketView): BucketTotal {
    const lineItems = BucketMapper.getLineItems(bucketData, basket);
    const surcharges = BasketSurchargeMapper.fromListData(bucketData?.surcharges);

    const { volumeDiscount } = basket;

    const sumUpPrice = (a: Price, b: Price): Price => {
      if (!a && !b) {
        return;
      }

      const value = a?.value ? a?.value + b?.value : b?.value;

      return {
        ...a,
        ...b,
        value,
      };
    };

    const sumUpPriceItem = (a: PriceItem, b: PriceItem): PriceItem => {
      if (!a && !b) {
        return;
      }

      const gross = a?.gross ? a?.gross + b?.gross : b?.gross;
      const net = a?.net ? a?.net + b?.net : b?.net;
      return {
        ...a,
        ...b,
        gross,
        net,
      };
    };

    type TotalsType = PropType<LineItem, 'totals'>;

    const lineItemsTotals = lineItems
      ?.map(lineItem => lineItem?.totals)
      ?.reduce<TotalsType>((prevTotals, currentTotals) => {
        const keys = Object.keys({ ...prevTotals, ...currentTotals });
        const newTotals = keys.reduce((acc, name) => {
          const prevTotal: Price | PriceItem = prevTotals[name];
          const currentTotal: Price | PriceItem = currentTotals[name];
          const totalType = prevTotal?.type || currentTotal?.type;
          const newTotal = {
            [name]: undefined,
          };

          switch (totalType) {
            case 'Money':
              newTotal[name] = sumUpPrice(prevTotal as Price, currentTotal as Price);
              break;
            case 'PriceItem':
              newTotal[name] = sumUpPriceItem(prevTotal as PriceItem, currentTotal as PriceItem);
              break;
          }

          return {
            ...acc,
            ...newTotal,
          };
          // tslint:disable-next-line:ish-no-object-literal-type-assertion
        }, {} as TotalsType);
        return { ...prevTotals, ...newTotals };
        // tslint:disable-next-line:ish-no-object-literal-type-assertion
      }, {} as TotalsType);

    const dutiesAndSurchargesTotal = PriceItemHelper.sumUp(
      surcharges?.filter(s => !s?.strikethrough)?.map(s => s?.amount)
    );

    const itemTotal = PriceItemHelper.addTaxIfMissing(lineItemsTotals?.total);

    const grandTotal = PriceItemHelper.sumUp([itemTotal, dutiesAndSurchargesTotal]);

    const grandTotalData = PriceItemMapper.toPriceItem(grandTotal);

    const total = grandTotal;

    const taxTotal = PriceItemMapper.fromSpecificPriceItem(grandTotalData, 'tax');

    return {
      ...lineItemsTotals,
      dutiesAndSurchargesTotal,
      itemTotal,
      total,
      taxTotal,
      surcharges,
      volumeDiscount,
    };
  }
}
