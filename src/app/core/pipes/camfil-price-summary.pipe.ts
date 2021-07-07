import { Pipe, PipeTransform } from '@angular/core';

import { Price } from 'ish-core/models/price/price.model';

@Pipe({ name: 'camfilPriceSummary', pure: true })
export class CamfilPriceSummaryPipe implements PipeTransform {
  transform(value: Price, quantity = 1): Price {
    if (!value) {
      return undefined as Price;
    }
    const price: Price = { currency: 'USD', value: 0, ...value };
    price.value = price.value * quantity;

    return price;
  }
}
