import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { IshProductsService } from 'camfil-pwa/services/ish-products/ish-products.service';
import { difference } from 'lodash-es';
import { exhaustMap, filter, map, mergeMap, withLatestFrom } from 'rxjs/operators';

import { ProductListingMapper } from 'ish-core/models/product-listing/product-listing.mapper';
import { ProductsService } from 'ish-core/services/products/products.service';
import { getUserLoading } from 'ish-core/store/customer/user';
import { getProductEntities, loadProductFail, loadProductSuccess } from 'ish-core/store/shopping/products';
import { ProductsEffects } from 'ish-core/store/shopping/products/products.effects';
import { HttpStatusCodeService } from 'ish-core/utils/http-status-code/http-status-code.service';
import { mapErrorToAction, mapToPayload, mapToPayloadProperty } from 'ish-core/utils/operators';

import {
  loadProducts,
  loadProductsFail,
  loadProductsIfNotLoaded,
  loadProductsSuccess,
} from './camfil-products.actions';

@Injectable()
// tslint:disable-next-line:project-structure
export class CamfilProductsEffects extends ProductsEffects {
  constructor(
    actions$: Actions,
    store: Store,
    productsService: ProductsService,
    httpStatusCodeService: HttpStatusCodeService,
    productListingMapper: ProductListingMapper,
    router: Router,
    @Inject(PLATFORM_ID) platformId: string,
    private camfilActions$: Actions,
    private camfilStore: Store,
    private camfilProductService: IshProductsService
  ) {
    super(actions$, store, productsService, httpStatusCodeService, productListingMapper, router, platformId);
  }

  loadProductsSuccess$ = createEffect(() =>
    this.camfilActions$.pipe(
      ofType(loadProductsSuccess),
      mapToPayloadProperty('products'),
      mergeMap(products => [...products.map(product => loadProductSuccess({ product }))])
    )
  );

  loadProductsFail$ = createEffect(() =>
    this.camfilActions$.pipe(
      ofType(loadProductsFail),
      mapToPayload(),
      mergeMap(({ error, skus }) => [...skus.map(sku => loadProductFail({ error, sku }))])
    )
  );

  loadProducts$ = createEffect(() =>
    this.camfilActions$.pipe(
      ofType(loadProducts),
      mapToPayloadProperty('skus'),
      withLatestFrom(this.camfilStore.pipe(select(getUserLoading))),
      filter(([, loading]) => !loading),
      exhaustMap(([skus]) =>
        this.camfilProductService.getProducts(skus).pipe(
          map(products => loadProductsSuccess({ products })),
          mapErrorToAction(loadProductsFail, { skus })
        )
      )
    )
  );

  loadProductsIfNotLoaded$ = createEffect(() =>
    this.camfilActions$.pipe(
      ofType(loadProductsIfNotLoaded),
      mapToPayload(),
      withLatestFrom(this.camfilStore.pipe(select(getProductEntities))),
      map(([{ skus }, entities]) => difference(skus, Object.keys(entities))),
      filter(skus => !!skus?.length),
      map(skus => loadProducts({ skus }))
    )
  );
}
