import { BasketSurcharge } from 'ish-core/models/basket-surcharge/basket-surcharge.model';
import { PriceItem } from 'ish-core/models/price-item/price-item.model';
import { Price } from 'ish-core/models/price/price.model';

export interface BucketTotal {
  dutiesAndSurchargesTotal: PriceItem;
  itemTotal: PriceItem;
  originTotal?: PriceItem;
  salesTaxTotal?: Price;
  shippingTaxTotal?: Price;
  shippingTotal: PriceItem;
  surcharges: BasketSurcharge[];
  taxTotal: Price;
  total: PriceItem;
  undiscountedTotal?: PriceItem;
  valueRebatesTotal?: PriceItem;
  volumeDiscount?: Price;
}
