import { Address } from 'ish-core/models/address/address.model';
import { BasketExtensions } from 'ish-core/models/basket/basket.interface';
import { LineItemView } from 'ish-core/models/line-item/line-item.model';

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

export interface Bucket extends BasketExtensions {
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
}

export interface BucketData {
  basket: string;
  lineItems?: string[];
  id: string;
  shipToAddress?: string;
  shippingMethod?: string;
}

export interface BucketIncluded {
  shipToAddress: {
    [key: string]: {
      id: string;
    };
  };
}

export interface Buckets {
  data: BucketData[];
  included: BucketIncluded;
}

export interface EditBucket extends Bucket {
  customerId?: string;
  company?: string;
  building?: string;
  address?: string;
  zipCode?: string;
  area?: string;
}
