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

export interface DataLayerItem {
  item_id?: string;
  item_name?: string;
  affiliation?: string;
  coupon?: string;
  discount?: number;
  index?: number;
  item_brand?: string;
  item_category?: string;
  item_category2?: string;
  item_category3?: string;
  item_category4?: string;
  item_category5?: string;
  item_list_id?: string;
  item_list_name?: string;
  item_variant?: string;
  location_id?: string;
  price?: number;
  quantity?: number;
}

export interface DataLayerEvent {
  event: DataLayerEventType;
  currency?: string;
  value?: number;
  items?: DataLayerItem[];
  purchase?: DataLayerDetail;
  item_list_id?: string;
  item_list_name?: string;
  page_type?: DataLayerPageType;
  transaction_id?: string;
  tax?: number;
  shipping?: number;
}

export enum DataLayerEventType {
  BeginCheckout = 'begin_checkout',
  CamCardEdit = 'edit_camcard',
  CamCardDelete = 'delete_camcard',
  CamCardAddItem = 'add_to_camcard',
  CamCardCreate = 'create_new_camcard',
  CartAddItem = 'add_to_cart',
  CartRemoveItem = 'remove_from_cart',
  CartView = 'view_cart',
  ItemSelect = 'select_item',
  ItemView = 'view_item',
  ItemListView = 'view_item_list',
  Purchase = 'purchase',
}

export enum DataLayerPageType {
  CamCardListing = 'cam card listing page',
  CamCardDetail = 'cam card detail page',
  Checkout = 'checkout page',
  ProductListing = 'product listing page',
  ProductDetail = 'product detail page',
  QuoteListing = 'quote listing',
  QuoteDetail = 'quote detail',
  SearchResult = 'search result page',
}
