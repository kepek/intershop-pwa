import { Address } from 'ish-core/models/address/address.model';
import { BasketExtension } from 'ish-core/models/basket-extension/basket-extension.model';
import { LineItemView } from 'ish-core/models/line-item/line-item.model';
import { PriceItem } from 'ish-core/models/price-item/price-item.model';
import { Price } from 'ish-core/models/price/price.model';

import { CamCardContact } from '../../../extensions/cam-cards/models/cam-card/cam-card.model';

export interface BucketAddress {
  id?: string;
  urn?: string;
  addressLine1?: string;
  addressLine2?: string;
  street?: string;
  postalCode?: string;
  city?: string;
  companyName1?: string;
  countryCode?: string;
  eligibleShipToAddress?: boolean;
}

export interface Bucket extends BasketExtension {
  basket: string;
  id: string;
  lineItems?: LineItemView[];
  shipToAddress?: string;
  deliveryAddressId?: string;
  nextDelivery?: string;
  shipToAddressFull?: Address;
  contacts?: CamCardContact[];
  contact?: string;
  shippingMethod?: string;
  createdFromCamCardId?: string;
  currentScrollIndex?: number;
  surcharges?: BucketSurcharge[];
}

export interface BucketIncluded {
  shipToAddress: {
    [key: string]: {
      id: string;
    };
  };
}

export interface EditBucket extends Bucket {
  customerId?: string;
  company?: string;
  building?: string;
  address?: string;
  zipCode?: string;
  area?: string;
}

export interface BucketSurcharge {
  amount: PriceItem;
  description?: string;
  displayName: string;
  taxes?: Price[];
}
