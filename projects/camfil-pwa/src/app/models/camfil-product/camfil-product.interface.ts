import { ProductData } from 'ish-core/models/product/product.interface';

export interface CamfilProductData extends ProductData {}

export interface CamfilProductsData {
  data: CamfilProductData[];
}
