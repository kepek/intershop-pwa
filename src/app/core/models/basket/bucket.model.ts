export interface Bucket {
  basket: string;
  id: string;
  lineItems?: string[];
  shipToAddress?: string;
  deliveryAddressId?: string;
  orderName?: string;
  nextDelivery?: string;
  orderMark?: string;
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
