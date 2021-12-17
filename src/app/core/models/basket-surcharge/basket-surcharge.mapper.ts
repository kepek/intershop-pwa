import { PriceItemMapper } from 'ish-core/models/price-item/price-item.mapper';

import { BasketSurchargeData } from './basket-surcharge.interface';
import { BasketSurcharge } from './basket-surcharge.model';

export class BasketSurchargeMapper {
  static fromData(data: BasketSurchargeData): BasketSurcharge {
    if (data) {
      return {
        amount: PriceItemMapper.fromPriceItem(data.amount),
        displayName: data.name,
        description: data.description,
      };
    }
  }

  static fromListData(data: BasketSurchargeData[]): BasketSurcharge[] {
    if (data?.length) {
      return data.map(BasketSurchargeMapper.fromData);
    }
  }
}
