import { PriceItem } from 'ish-core/models/price-item/price-item.model';

export interface BasketSurcharge {
  amount: PriceItem;
  displayName: string;
  description: string;
  taxes?: PriceItem[];
  strikethrough?: boolean;
}
