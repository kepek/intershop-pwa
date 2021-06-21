import { LineItem, LineItemView } from 'ish-core/models/line-item/line-item.model';
import { PriceItem } from 'ish-core/models/price-item/price-item.model';

import { Price } from './price.model';
import { formatPrice } from './price.pipe';

export class PriceHelper {
  private static sanityChecks(p1: Price, p2: Price) {
    if (!p1 || !p2) {
      throw new Error('cannot handle undefined inputs');
    }
    if (!Number.isFinite(p1.value) || !Number.isFinite(p2.value)) {
      throw new Error('cannot handle undefined values');
    }
    if (!p1.currency || !p2.currency) {
      throw new Error('cannot handle undefined currency');
    }
    if (p1.currency !== p2.currency) {
      throw new Error('currency mispatch');
    }
  }

  static diff(p1: Price, p2: Price): Price {
    PriceHelper.sanityChecks(p1, p2);
    return {
      type: p1.type,
      currency: p1.currency,
      value: Math.round((p1.value - p2.value) * 100) / 100,
    };
  }

  /**
   * Inverts the value of a price
   * @param price The price
   * @returns inverted price
   */
  static invert<T extends Price | PriceItem>(price: T): T {
    if (price) {
      if (price.type === 'Money') {
        return { ...price, value: (price as Price).value * -1 };
      }
      return { ...price, gross: (price as PriceItem).gross * -1, net: (price as PriceItem).net * -1 };
    }
  }

  static min(p1: Price, p2: Price): Price {
    PriceHelper.sanityChecks(p1, p2);
    return {
      type: p1.type,
      currency: p1.currency,
      value: Math.round(Math.min(p1.value, p2.value) * 100) / 100,
    };
  }

  static sum(p1: Price, p2: Price): Price {
    PriceHelper.sanityChecks(p1, p2);
    return {
      type: p1.type,
      currency: p1.currency,
      value: Math.round((p1.value + p2.value) * 100) / 100,
    };
  }

  static empty(currency?: string): Price {
    return {
      type: 'Money',
      value: 0,
      currency,
    };
  }

  static totalPrice(items: LineItemView[], type = 'net'): Price {
    const getCurrency = element => element.price?.currency;
    const getValue = element => element.totals?.total[type];

    return PriceHelper.getPrice(getCurrency, getValue, items);
  }

  static totalTax(items: LineItemView[]): Price {
    const getCurrency = element => element.totals?.salesTaxTotal.currency;
    const getValue = element => element.totals?.salesTaxTotal.value;

    return PriceHelper.getPrice(getCurrency, getValue, items);
  }

  static savedAmount(items: LineItemView[]): Price {
    const getCurrency = element => element.price?.currency;
    const getValue = element => element.totals?.total.gross - element.price?.gross;

    return PriceHelper.getPrice(getCurrency, getValue, items);
  }

  static discount(items: LineItemView[]): Price {
    const getCurrency = element => element.price?.currency;
    const getValue = element => element.totals?.total.gross - element.totals?.undiscountedTotal.gross;

    return PriceHelper.getPrice(getCurrency, getValue, items);
  }

  static getPrice(
    getCurrency: (item: LineItem) => string,
    getValue: (item: LineItem) => number,
    items: LineItemView[] = []
  ): Price {
    const price: Price = {
      type: 'Money',
      currency: 'EUR',
      value: 0,
    };

    items?.forEach(element => {
      price.currency = getCurrency(element);
      price.value = price.value + getValue(element);
    });

    return price;
  }

  static getVolumeDiscountPrice(value, currency, currentLang) {
    const priceData: Price = {
      value,
      currency,
      type: 'Money',
    };
    return (value || value === 0) && currency ? formatPrice(priceData, currentLang) : 0;
  }
}
