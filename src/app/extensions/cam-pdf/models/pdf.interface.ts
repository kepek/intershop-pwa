import { ProductView } from 'ish-core/models/product-view/product-view.model';

export interface DataToPdf {
  content: {};
  styles: {};
  images: {};
}

export interface PDFProductLine {
  line1: any[];
  line2: any[];
  line3: any[];
  line4: any[];
}

export interface ProductsObj {
  [sku: string]: ProductView;
}

export interface CamCardTotalPricesObj {
  [camCardId: string]: number;
}
