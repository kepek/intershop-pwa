import { AddressData } from 'ish-core/models/address/address.interface';
import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { BasketSurchargeData } from 'ish-core/models/basket-surcharge/basket-surcharge.interface';

export interface BucketBaseData {
  basket: string;
  lineItems?: string[];
  id: string;
  shipToAddress?: string;
  shippingMethod?: string;
  surcharges?: BasketSurchargeData[];
}

export interface BucketData {
  data: BucketBaseData[];
  included?: {
    shipToAddress?: { [urn: string]: AddressData };
    shippingMethod?: {
      [name: string]: {
        attributes: Attribute[];
        digitalDelivery: boolean;
        id: string;
        name: string;
        shippingInstructionsSupported: boolean;
      };
    };
  };
}
