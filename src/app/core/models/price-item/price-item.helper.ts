import { Price } from 'ish-core/models/price/price.model';

import { PriceItem } from './price-item.model';

export class PriceItemHelper {
  static selectType(priceItem: PriceItem, type: 'gross' | 'net'): Price {
    if (priceItem && type) {
      return {
        type: 'Money',
        currency: priceItem.currency,
        value: priceItem[type],
      };
    }
  }

  static sumUp(priceItems: PriceItem[]): PriceItem {
    if (!priceItems?.length) {
      return;
    }

    const initialValue: PriceItem = {
      type: 'PriceItem',
      gross: 0,
      net: 0,
      currency: 'N/A',
    };

    return priceItems.filter(Boolean).reduce((acc, value) => {
      const gross = acc.gross + value.gross;
      const net = acc.net + value.net;
      const tax = gross - net;
      return { ...acc, ...value, gross, net, tax };
    }, initialValue);
  }

  static addTaxIfMissing(priceItem: PriceItem) {
    if (!priceItem) {
      return;
    }

    if (priceItem?.tax) {
      return priceItem;
    }

    const { gross, net } = priceItem;

    const tax = gross && net ? gross - net : undefined;

    return { tax, ...priceItem };
  }
}
