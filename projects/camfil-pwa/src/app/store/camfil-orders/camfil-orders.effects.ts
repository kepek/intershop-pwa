import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { CamfilOrderService } from 'camfil-pwa/services/camfil-order/camfil-order.service';
import { loadOrderIfNotLoaded } from 'camfil-pwa/store/customer/orders';
import { isEqual } from 'lodash-es';
import { identity, iif } from 'rxjs';
import {
  concatMap,
  debounceTime,
  distinctUntilChanged,
  filter,
  groupBy,
  map,
  mergeMap,
  switchMap,
  takeWhile,
  tap,
  throttleTime,
  window,
  withLatestFrom,
} from 'rxjs/operators';

import { ProductCompletenessLevel } from 'ish-core/models/product/product.helper';
import { displayErrorMessage } from 'ish-core/store/core/messages';
import { ofUrl, selectRouteParam } from 'ish-core/store/core/router';
import { loadBasket } from 'ish-core/store/customer/basket';
import { getProducts, loadProductIfNotLoaded, loadProductSuccess } from 'ish-core/store/shopping/products';
import { mapErrorToAction, mapToPayload, mapToPayloadProperty, whenTruthy } from 'ish-core/utils/operators';

import {
  cloneCamfilOrder,
  cloneCamfilOrderFail,
  cloneCamfilOrderSuccess,
  loadCamfilOrder,
  loadCamfilOrderAdditionalTotalCost,
  loadCamfilOrderAdditionalTotalCostFail,
  loadCamfilOrderAdditionalTotalCostSuccess,
  loadCamfilOrderFail,
  loadCamfilOrderIfNotLoaded,
  loadCamfilOrderLineItems,
  loadCamfilOrderLineItemsFail,
  loadCamfilOrderLineItemsSuccess,
  loadCamfilOrderSuccess,
  loadCamfilOrderTrackAndTrace,
  loadCamfilOrderTrackAndTraceFail,
  loadCamfilOrderTrackAndTraceSuccess,
  loadCamfilOrders,
  loadCamfilOrdersFail,
  loadCamfilOrdersSuccess,
  selectCamfilOrder,
  updateCamfilOrder,
} from './camfil-orders.actions';
import { getCamfilOrderEntities, getSelectedOrder, getSelectedOrderId } from './camfil-orders.selectors';

@Injectable()
export class CamfilOrdersEffects {
  constructor(
    private actions$: Actions,
    private camfilOrderService: CamfilOrderService,
    private router: Router,
    private store: Store,
    @Inject(PLATFORM_ID) private platformId: string
  ) {}

  loadCamfilOrderIfNotLoaded$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCamfilOrderIfNotLoaded),
      mapToPayload(),
      withLatestFrom(this.store.pipe(select(getCamfilOrderEntities))),
      filter(([{ orderId }, entities]) => !entities?.[orderId]),
      groupBy(([{ orderId }]) => orderId),
      mergeMap(group$ =>
        group$.pipe(
          this.throttleOnBrowser(),
          map(([{ orderId }]) => loadCamfilOrder({ orderId }))
        )
      )
    )
  );

  loadCamfilOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCamfilOrder),
      mapToPayloadProperty('orderId'),
      whenTruthy(),
      concatMap(orderId =>
        this.camfilOrderService.getCamfilOrder(orderId).pipe(
          map(order => loadCamfilOrderSuccess({ order })),
          mapErrorToAction(loadCamfilOrderFail)
        )
      )
    )
  );

  loadCamfilOrderSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCamfilOrderSuccess),
      mapToPayloadProperty('order'),
      whenTruthy(),
      mergeMap(order => [
        loadCamfilOrderLineItems({ orderId: order.id }),
        loadOrderIfNotLoaded({ orderId: order.ishOrderUUID }),
      ])
    )
  );

  loadTrackAndTraceForSelectedCamfilOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCamfilOrderLineItemsSuccess),
      mapToPayload(),
      switchMap(({ orderId }) => [loadCamfilOrderTrackAndTrace({ orderId })])
    )
  );

  loadAdditionalCostForSelectedCamfilOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCamfilOrderLineItemsSuccess),
      mapToPayload(),
      switchMap(({ orderId }) => [loadCamfilOrderAdditionalTotalCost({ orderId })])
    )
  );

  loadProductsForSelectedCamfilOrderLineItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCamfilOrderLineItemsSuccess),
      mapToPayload(),
      switchMap(({ lineItems }) => [
        ...lineItems.map(({ sku }) => loadProductIfNotLoaded({ sku, level: ProductCompletenessLevel.List })),
      ])
    )
  );

  loadCamfilOrderForSelectedCamfilOrder$ = createEffect(() =>
    iif(
      () => isPlatformBrowser(this.platformId),
      this.actions$.pipe(
        ofType(selectCamfilOrder),
        mapToPayloadProperty('orderId'),
        whenTruthy(),
        mergeMap(orderId => [loadCamfilOrder({ orderId })])
      )
    )
  );

  routeListenerForSelectingCamfilOrder$ = createEffect(() =>
    this.store.pipe(
      ofUrl(/^\/(account\/orders.*|checkout\/receipt)/),
      select(selectRouteParam('orderId')),
      withLatestFrom(this.store.pipe(select(getSelectedOrderId))),
      filter(([fromAction, selectedOrderId]) => fromAction && fromAction !== selectedOrderId),
      map(([orderId]) => orderId),
      map(orderId => selectCamfilOrder({ orderId }))
    )
  );

  loadCamfilOrders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCamfilOrders),
      concatMap(() =>
        this.camfilOrderService.getCamfilOrders().pipe(
          map(orders => loadCamfilOrdersSuccess({ orders })),
          mapErrorToAction(loadCamfilOrdersFail)
        )
      )
    )
  );

  loadCamfilOrderLineItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCamfilOrderLineItems),
      mapToPayloadProperty('orderId'),
      concatMap(orderId =>
        this.camfilOrderService.getCamfilOrderLineItems(orderId).pipe(
          map(lineItems => loadCamfilOrderLineItemsSuccess({ orderId, lineItems })),
          mapErrorToAction(loadCamfilOrderLineItemsFail)
        )
      )
    )
  );

  loadCamfilOrderTrackAndTrace$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCamfilOrderTrackAndTrace),
      mapToPayloadProperty('orderId'),
      concatMap(orderId =>
        this.camfilOrderService.getCamfilOrderTrackAndTrace(orderId).pipe(
          map(trackAndTrace => loadCamfilOrderTrackAndTraceSuccess({ orderId, trackAndTrace })),
          mapErrorToAction(loadCamfilOrderTrackAndTraceFail)
        )
      )
    )
  );

  loadCamfilOrderAdditionalTotalCost$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCamfilOrderAdditionalTotalCost),
      mapToPayloadProperty('orderId'),
      concatMap(orderId =>
        this.camfilOrderService.getCamfilOrderAdditionalTotalCost(orderId).pipe(
          map(additionalTotalCost => loadCamfilOrderAdditionalTotalCostSuccess({ orderId, additionalTotalCost })),
          mapErrorToAction(loadCamfilOrderAdditionalTotalCostFail)
        )
      )
    )
  );

  cloneCamfilOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(cloneCamfilOrder),
      mapToPayloadProperty('orderId'),
      concatMap(orderId =>
        this.camfilOrderService.cloneCamfilOrder(orderId).pipe(
          map(basket => cloneCamfilOrderSuccess({ basket })),
          mapErrorToAction(cloneCamfilOrderFail)
        )
      )
    )
  );

  redirectAfterCamfilOrderClone$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(cloneCamfilOrderSuccess),
        takeWhile(() => isPlatformBrowser(this.platformId)),
        whenTruthy(),
        tap(() => {
          this.router.navigateByUrl('/checkout');
        }),
        map(loadBasket)
      ),
    { dispatch: true }
  );

  displayCreateOrderCloneFailMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(cloneCamfilOrderFail),
      mapToPayloadProperty('error'),
      whenTruthy(),
      map(error =>
        displayErrorMessage({
          message: error?.message || error?.code,
        })
      )
    )
  );

  loadProductsForSelectedCamfilOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadProductSuccess),
      mapToPayload(),
      // accumulate all actions
      window(this.actions$.pipe(ofType(loadProductSuccess), debounceTime(1000))),
      mergeMap(window$ =>
        window$.pipe(
          withLatestFrom(
            this.store.pipe(
              select(getSelectedOrder),
              map(order =>
                order?.lineItems?.reduce<string[]>((acc, val) => {
                  acc.push(val?.sku);
                  return acc;
                }, [])
              )
            )
          ),
          filter(([, skus]) => !!skus?.length),
          switchMap(([, skus]) => this.store.pipe(select(getProducts, { skus }))),
          // check whether product failed or availability when not failed
          map(products =>
            products.map(({ availability, failed, sku }) => ({ sku, availability: failed ? false : availability }))
          ),
          // check if all products are available, if not user should not be able to re-order
          map(availabilities => availabilities.every(({ availability }) => !!availability)),
          distinctUntilChanged(isEqual),
          withLatestFrom(this.store.pipe(select(getSelectedOrder))),
          mergeMap(([canReOrder, order]) => [updateCamfilOrder({ order: { ...order, canReOrder } })])
        )
      )
    )
  );

  private throttleOnBrowser() {
    return isPlatformBrowser(this.platformId) && this.router.navigated ? throttleTime(100) : map(identity);
  }
}
