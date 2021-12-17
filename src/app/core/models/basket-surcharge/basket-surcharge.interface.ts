import { PriceItemData } from 'ish-core/models/price-item/price-item.interface';
import { PriceData } from 'ish-core/models/price/price.interface';

export interface BasketSurchargeData {
  amount: PriceItemData;
  description?: string;
  name: string;
  taxes?: PriceData[];
}
