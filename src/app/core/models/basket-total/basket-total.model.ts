import { BasketRebate } from 'ish-core/models/basket-rebate/basket-rebate.model';
import { BasketSurcharge } from 'ish-core/models/basket-surcharge/basket-surcharge.model';
import { PriceItem } from 'ish-core/models/price-item/price-item.model';
import { Price } from 'ish-core/models/price/price.model';

export interface BasketTotal {
  discountTotal: PriceItem;
  itemTotal: PriceItem;
  undiscountedItemTotal?: PriceItem;
  shippingTotal?: PriceItem;
  undiscountedShippingTotal?: PriceItem;
  paymentCostsTotal?: PriceItem;
  dutiesAndSurchargesTotal?: PriceItem;
  taxTotal?: Price;
  total: PriceItem;
  itemRebatesTotal?: PriceItem;
  valueRebatesTotal?: PriceItem;
  valueRebates?: BasketRebate[];
  itemShippingRebatesTotal?: PriceItem;
  shippingRebatesTotal?: PriceItem;
  shippingRebates?: BasketRebate[];
  itemSurchargeTotalsByType?: BasketSurcharge[];
  bucketSurchargeTotalsByType?: BasketSurcharge[];
  isEstimated: boolean;
}
