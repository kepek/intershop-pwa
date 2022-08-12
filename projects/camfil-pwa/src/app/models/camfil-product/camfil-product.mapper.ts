import { Injectable } from '@angular/core';
import { CamfilProductsData } from 'camfil-pwa/models/camfil-product/camfil-product.interface';

import { CategoryMapper } from 'ish-core/models/category/category.mapper';
import { ImageMapper } from 'ish-core/models/image/image.mapper';
import { ProductMapper } from 'ish-core/models/product/product.mapper';

import { CamfilProducts } from './camfil-product.model';

@Injectable({ providedIn: 'root' })
export class CamfilProductMapper extends ProductMapper {
  constructor(imageMapper: ImageMapper, categoryMapper: CategoryMapper) {
    super(imageMapper, categoryMapper);
  }

  fromListData = (payload: CamfilProductsData): CamfilProducts => {
    if (Array.isArray(payload.data)) {
      return payload.data.map(d => this.fromData(d));
    }
  };
}
