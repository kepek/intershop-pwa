import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { loadProductsIfNotLoaded } from 'camfil-pwa/store/camfil-shopping/camfil-products/camfil-products.actions';
import {
  getCamfilProductsError,
  getCamfilProductsLoading,
} from 'camfil-pwa/store/camfil-shopping/camfil-products/camfil-products.selectors';
import { Observable } from 'rxjs';
import { filter, shareReplay, switchMap, tap } from 'rxjs/operators';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { ProductCompletenessLevel, ProductHelper } from 'ish-core/models/product/product.helper';
import { getProduct, getProducts } from 'ish-core/store/shopping/products';
import { toObservable } from 'ish-core/utils/functions';

@Injectable({ providedIn: 'root' })
export class CamfilShoppingFacade extends ShoppingFacade {
  constructor(store: Store, private camfilStore: Store) {
    super(store);
  }

  productsLoading$ = this.camfilStore.pipe(select(getCamfilProductsLoading), shareReplay(1));

  productsError$ = this.camfilStore.pipe(select(getCamfilProductsError));

  products$(skus: string[] | Observable<string[]>) {
    return toObservable(skus).pipe(
      tap(plainSKUs => {
        this.camfilStore.dispatch(loadProductsIfNotLoaded({ skus: plainSKUs }));
      }),
      switchMap(plainSKUs => this.camfilStore.pipe(select(getProducts, { skus: plainSKUs })))
    );
  }

  getProduct$(sku: string | Observable<string>, level: ProductCompletenessLevel) {
    return toObservable(sku).pipe(
      switchMap(plainSKU =>
        this.camfilStore.pipe(
          select(getProduct, { sku: plainSKU }),
          filter(p => ProductHelper.isReadyForDisplay(p, level))
        )
      )
    );
  }

  getProducts$(skus: string[] | Observable<string[]>) {
    return toObservable(skus).pipe(
      switchMap(plainSKUs => this.camfilStore.pipe(select(getProducts, { skus: plainSKUs })))
    );
  }
}
