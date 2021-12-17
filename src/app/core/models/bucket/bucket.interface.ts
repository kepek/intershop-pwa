import { BasketSurchargeData } from 'ish-core/models/basket-surcharge/basket-surcharge.interface';
import { BucketIncluded } from 'ish-core/models/bucket/bucket.model';

export interface BucketData {
  basket: string;
  lineItems?: string[];
  id: string;
  shipToAddress?: string;
  shippingMethod?: string;
  surcharges?: BasketSurchargeData[];
}

export interface BucketsData {
  data: BucketData[];
  included: BucketIncluded;
}
