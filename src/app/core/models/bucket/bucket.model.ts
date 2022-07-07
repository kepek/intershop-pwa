import { Address } from 'ish-core/models/address/address.model';
import { BasketExtension } from 'ish-core/models/basket-extension/basket-extension.model';
import { BucketTotal } from 'ish-core/models/bucket-total/bucket-total.model';
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
  totals: BucketTotal;
  purchaseCurrency?: string;
}

export interface EditBucket extends Bucket {
  customerId?: string;
  company?: string;
  addressLine1?: string;
  addressLine2?: string;
  zipCode?: string;
  area?: string;
}
