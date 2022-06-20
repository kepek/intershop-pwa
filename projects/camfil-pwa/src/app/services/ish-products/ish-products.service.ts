import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { CamfilProductsData } from 'camfil-pwa/models/camfil-product/camfil-product.interface';
import { CamfilProductMapper } from 'camfil-pwa/models/camfil-product/camfil-product.mapper';
import { CamfilProducts } from 'camfil-pwa/models/camfil-product/camfil-product.model';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

import { ProductMapper } from 'ish-core/models/product/product.mapper';
import { ApiService, AvailableOptions } from 'ish-core/services/api/api.service';
import { ProductsService } from 'ish-core/services/products/products.service';
import { FeatureToggleService } from 'ish-core/utils/feature-toggle/feature-toggle.service';

@Injectable({ providedIn: 'root' })
export class IshProductsService extends ProductsService {
  constructor(
    apiService: ApiService,
    productMapper: ProductMapper,
    store: Store,
    featureToggleService: FeatureToggleService,
    private camfilApiService: ApiService,
    private camfilProductMapper: CamfilProductMapper
  ) {
    super(apiService, productMapper, store, featureToggleService);
  }

  private camfilProductsOptions: AvailableOptions = {
    sendSPGID: true,
  };

  getProducts(skus: string[]): Observable<CamfilProducts> {
    if (!skus?.length) {
      return throwError('getProducts() called without a skus');
    }

    const params = new HttpParams().set('allImages', 'true').set('cache', 'false');
    const options: AvailableOptions = { ...this.camfilProductsOptions, params };
    const body = JSON.stringify(skus);

    return this.camfilApiService
      .post<CamfilProductsData>(`camfilproductlist`, body, options)
      .pipe(map(this.camfilProductMapper.fromListData));
  }
}
