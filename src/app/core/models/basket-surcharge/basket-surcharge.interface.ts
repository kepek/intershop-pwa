import { PriceItemData } from 'ish-core/models/price-item/price-item.interface';

export interface BasketSurchargeData {
  amount: PriceItemData;
  description?: string;
  name: string;
  taxes?: PriceItemData[];
}
