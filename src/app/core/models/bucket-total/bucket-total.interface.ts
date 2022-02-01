import { PriceItemData } from 'ish-core/models/price-item/price-item.interface';

export interface BucketTotalData {
  salesTaxTotal?: PriceItemData;
  shippingTaxTotal?: PriceItemData;
  shippingTotal: PriceItemData;
  total: PriceItemData;
  undiscountedTotal: PriceItemData;
  valueRebatesTotal?: PriceItemData;
  originTotal?: PriceItemData;
}
