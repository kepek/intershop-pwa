import { BasketSurcharge } from 'ish-core/models/basket-surcharge/basket-surcharge.model';
import { PriceItem } from 'ish-core/models/price-item/price-item.model';
import { Price } from 'ish-core/models/price/price.model';

export interface BucketTotal {
  salesTaxTotal?: Price;
  shippingTaxTotal?: Price;
  shippingTotal: PriceItem;
  total: PriceItem;
  taxTotal: Price;
  itemTotal: PriceItem;
  undiscountedTotal?: PriceItem;
  valueRebatesTotal?: PriceItem;
  originTotal?: PriceItem;
  volumeDiscount?: Price;
  surcharges: BasketSurcharge[];
  dutiesAndSurchargesTotal: PriceItem;
}
