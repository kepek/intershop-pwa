import { LineItem } from 'ish-core/models/line-item/line-item.model';

import {
  CamCardAddress,
  CamCardContact,
  CamCardCustomer,
} from '../../../extensions/cam-cards/models/cam-card/cam-card.model';

export interface BucketAddress {
  addressLine1?: string;
  addressLine2?: string;
  street?: string;
  postalCode?: string;
  city?: string;
  companyName1?: string;
}

export interface Bucket {
  basket: string;
  id: string;
  lineItems?: LineItem[];
  shipToAddress?: string;
  deliveryAddressId?: string;
  orderName?: string;
  nextDelivery?: string;
  transient?: boolean;
  shipToAddressFull?: CamCardAddress;
  contacts?: CamCardContact[];
  camCardId?: string;
  contactPersonId?: string;
  customer?: CamCardCustomer;
  orderMark?: string;
  invoiceLabel?: string;
  deliveryAddress?: BucketAddress;
  boxLabel?: string;
  contact?: string;
  info?: string;
  phoneNumber?: string;
}

export interface BucketData {
  basket: string;
  lineItems?: string[];
  id: string;
  shipToAddress?: string;
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
