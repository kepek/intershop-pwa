import { Injectable } from '@angular/core';

import { Quantity, QuoteItemData, QuoteLineProps, QuoteLineStringProps } from './quote-item.interface';
import { QuoteItem } from './quote-item.model';

@Injectable({ providedIn: 'root' })
export class QuoteItemMapper {
  fromData(data: QuoteItemData): QuoteItem {
    if (data) {
      const quantity = this.getPropFromData(data, 'quantity');

      return {
        id: data.itemId,
        title: data.title,
        uri: data.uri,
        productSKU: this.getPropFromData(data, 'productSKU'),
        quantity: {
          value: quantity.value,
          unit: quantity.unit,
        },
      };
    } else {
      throw new Error('Quote item data is required');
    }
  }

  private getPropFromData(data: QuoteItemData, prop: 'quantity'): Quantity;
  private getPropFromData(data: QuoteItemData, prop: QuoteLineStringProps): string;
  private getPropFromData(data: QuoteItemData, prop: QuoteLineProps): string | Quantity {
    const attr = data.attributes.find(attribute => attribute.name === prop);
    return attr?.value;
  }
}
