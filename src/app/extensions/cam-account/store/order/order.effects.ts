import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { isEqual } from 'lodash-es';
import { iif } from 'rxjs';
import {
  concatMap,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  mergeMap,
  switchMap,
  takeWhile,
  tap,
  window,
  withLatestFrom,
} from 'rxjs/operators';

import { ProductCompletenessLevel } from 'ish-core/models/product/product.helper';
import { displayErrorMessage } from 'ish-core/store/core/messages';
import { ofUrl, selectRouteParam } from 'ish-core/store/core/router';
import { loadBasket } from 'ish-core/store/customer/basket';
import { getProducts, loadProductIfNotLoaded, loadProductSuccess } from 'ish-core/store/shopping/products';
import { mapErrorToAction, mapToPayload, mapToPayloadProperty, whenTruthy } from 'ish-core/utils/operators';

import { OrderService } from '../../services/order/order.service';

import {
  createOrderDuplicate,
  createOrderDuplicateFail,
  createOrderDuplicateSuccess,
  loadOrder,
  loadOrderAdditionalTotalCost,
  loadOrderAdditionalTotalCostFail,
  loadOrderAdditionalTotalCostSuccess,
  loadOrderFail,
  loadOrderLineItems,
  loadOrderLineItemsFail,
  loadOrderLineItemsSuccess,
  loadOrderSuccess,
  loadOrderTrackAndTrace,
  loadOrderTrackAndTraceFail,
  loadOrderTrackAndTraceSuccess,
  loadOrders,
  loadOrdersFail,
  loadOrdersSuccess,
  selectOrder,
  updateOrder,
} from './order.actions';
import { getSelectedOrder, getSelectedOrderId } from './order.selectors';

@Injectable()
export class OrderEffects {
  constructor(
    private actions$: Actions,
    private camfilOrderService: OrderService,
    private router: Router,
    private store: Store,
    @Inject(PLATFORM_ID) private platformId: string
  ) {}

  loadOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadOrder),
      mapToPayloadProperty('orderId'),
      concatMap(orderId =>
        this.camfilOrderService.getOrder(orderId).pipe(
          map(order => loadOrderSuccess({ order })),
          mapErrorToAction(loadOrderFail)
        )
      )
    )
  );

  loadOrderSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadOrderSuccess),
      mapToPayloadProperty('order'),
      map(order => order?.id),
      whenTruthy(),
      mergeMap(orderId => [loadOrderLineItems({ orderId })])
    )
  );

  loadTrackAndTraceForSelectedOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadOrderLineItemsSuccess),
      mapToPayload(),
      switchMap(({ orderId }) => [loadOrderTrackAndTrace({ orderId })])
    )
  );

  loadAdditionalCostForSelectedOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadOrderLineItemsSuccess),
      mapToPayload(),
      switchMap(({ orderId }) => [loadOrderAdditionalTotalCost({ orderId })])
    )
  );

  loadProductsForSelectedOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadOrderLineItemsSuccess),
      mapToPayload(),
      switchMap(({ lineItems }) => [
        ...lineItems.map(({ sku }) => loadProductIfNotLoaded({ sku, level: ProductCompletenessLevel.List })),
      ])
    )
  );

  loadOrderForSelectedOrder$ = createEffect(() =>
    iif(
      () => isPlatformBrowser(this.platformId),
      this.actions$.pipe(
        ofType(selectOrder),
        mapToPayloadProperty('orderId'),
        whenTruthy(),
        mergeMap(orderId => [loadOrder({ orderId })])
      )
    )
  );

  routeListenerForSelectingOrder$ = createEffect(() =>
    this.store.pipe(
      ofUrl(/^\/(account\/orders.*|checkout\/receipt)/),
      select(selectRouteParam('orderId')),
      withLatestFrom(this.store.pipe(select(getSelectedOrderId))),
      filter(([fromAction, selectedOrderId]) => fromAction && fromAction !== selectedOrderId),
      map(([orderId]) => orderId),
      map(orderId => selectOrder({ orderId }))
    )
  );

  loadOrders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadOrders),
      concatMap(() =>
        this.camfilOrderService.getOrders().pipe(
          map(orders => loadOrdersSuccess({ orders })),
          mapErrorToAction(loadOrdersFail)
        )
      )
    )
  );

  loadOrderLineItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadOrderLineItems),
      mapToPayloadProperty('orderId'),
      concatMap(orderId =>
        this.camfilOrderService.getOrderLineItems(orderId).pipe(
          map(lineItems => loadOrderLineItemsSuccess({ orderId, lineItems })),
          mapErrorToAction(loadOrderLineItemsFail)
        )
      )
    )
  );

  loadOrderTrackAndTrace$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadOrderTrackAndTrace),
      mapToPayloadProperty('orderId'),
      concatMap(orderId =>
        this.camfilOrderService.getOrderTrackAndTrace(orderId).pipe(
          map(trackAndTrace => loadOrderTrackAndTraceSuccess({ orderId, trackAndTrace })),
          mapErrorToAction(loadOrderTrackAndTraceFail)
        )
      )
    )
  );

  loadOrderAdditionalTotalCost$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadOrderAdditionalTotalCost),
      mapToPayloadProperty('orderId'),
      concatMap(orderId =>
        this.camfilOrderService.getOrderAdditionalTotalCost(orderId).pipe(
          map(additionalTotalCost => loadOrderAdditionalTotalCostSuccess({ orderId, additionalTotalCost })),
          mapErrorToAction(loadOrderAdditionalTotalCostFail)
        )
      )
    )
  );

  createOrderDuplicate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createOrderDuplicate),
      mapToPayloadProperty('orderId'),
      concatMap(orderId =>
        this.camfilOrderService.createOrderDuplicate(orderId).pipe(
          map(basket => createOrderDuplicateSuccess({ basket })),
          mapErrorToAction(createOrderDuplicateFail)
        )
      )
    )
  );

  redirectAfterOrderDuplicate$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(createOrderDuplicateSuccess),
        takeWhile(() => isPlatformBrowser(this.platformId)),
        whenTruthy(),
        tap(() => {
          this.router.navigateByUrl('/checkout');
        }),
        map(loadBasket)
      ),
    { dispatch: true }
  );

  displayCreateOrderDuplicateFailMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createOrderDuplicateFail),
      mapToPayloadProperty('error'),
      whenTruthy(),
      map(error =>
        displayErrorMessage({
          message: error?.message || error?.code,
        })
      )
    )
  );

  loadProductsForSelectedOrderSuccess$ = createEffect(() =>
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
          mergeMap(([canReOrder, order]) => [updateOrder({ order: { ...order, canReOrder } })])
        )
      )
    )
  );
}
