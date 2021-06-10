export interface DataLayerProduct {
  id: string;
  name: string;
  price: string | number;
  brand: string;
  category: string;
  variant: string;
  quantity?: number;
}

export interface DataLayerDetail {
  products: DataLayerProduct[];
  actionField?: {
    list?: string;
    step?: number;
    option?: string;
    id?: string;
    affiliation?: string;
    revenue?: number;
    tax?: number;
    shipping?: number;
    coupon?: string;
  };
}

export interface DataLayerEvent {
  event: DataLayerEventType;
  ecommerce: {
    currencyCode?: string;
    purchase?: DataLayerDetail;
  };
}

export enum DataLayerEventType {
  Purchase = 'purchase',
}
