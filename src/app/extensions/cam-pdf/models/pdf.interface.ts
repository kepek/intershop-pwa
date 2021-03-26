import { Price } from 'ish-core/models/price/price.model';
import { ProductView } from 'ish-core/models/product-view/product-view.model';

export interface DataToPdf {
  content: {};
  styles: {};
  images: {};
}

export interface ProductsObj {
  [sku: string]: ProductView;
}

export interface CamCardTotalPricesObj {
  [camCardId: string]: Price;
}
