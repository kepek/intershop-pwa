import { PriceItemData } from 'ish-core/models/price-item/price-item.interface';
import { Price } from 'ish-core/models/price/price.model';

import { PriceItem } from './price-item.model';

export class PriceItemMapper {
  /**
   * Maps a price item to client side model instance.
   * @param priceItem Server representation.
   * @returns         The {@link PriceItem}.
   */
  static fromPriceItem(priceItem: PriceItemData): PriceItem {
    if (priceItem && priceItem.gross && priceItem.net) {
      return {
        type: 'PriceItem',
        gross: priceItem.gross.value,
        net: priceItem.net.value,
        tax: priceItem?.tax?.value,
        currency: priceItem.gross.currency,
      };
    }
  }

  static toPriceItem(price: PriceItem): PriceItemData {
    const { gross, net, currency } = price;

    if (gross && net) {
      const tax = price?.tax ? { value: price.tax, currency } : undefined;

      return {
        gross: { value: gross, currency },
        net: { value: gross, currency },
        tax,
      };
    }
  }

  /**
   * Maps a price item to a gross or net price.
   * @param priceItem Server representation.
   * @param priceType The price type
   * @returns         The {@link Price}.
   */
  static fromSpecificPriceItem(priceItem: PriceItemData, priceType: keyof PriceItemData): Price {
    if (priceItem && priceType && priceItem[priceType]) {
      return {
        type: 'Money',
        value: priceItem[priceType].value,
        currency: priceItem[priceType].currency,
      };
    }
  }
}
