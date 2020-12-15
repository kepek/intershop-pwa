import {
  CamCardAddress,
  CamCardContact,
  CamCardCustomer,
} from '../../../extensions/cam-cards/models/cam-card/cam-card.model';

export interface Bucket {
  basket: string;
  id: string;
  lineItems?: string[];
  shipToAddress?: string;
  deliveryAddressId?: string;
  orderName?: string;
  nextDelivery?: string;
  orderMark?: string;
  transient?: boolean;
  shipToAddressFull?: CamCardAddress;
  customer?: CamCardCustomer;
  contacts?: CamCardContact[];
  camCardId?: string;
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
