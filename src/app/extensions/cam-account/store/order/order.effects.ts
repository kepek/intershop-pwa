import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { concatMap, filter, map, takeWhile, tap, withLatestFrom } from 'rxjs/operators';

import { displayErrorMessage } from 'ish-core/store/core/messages';
import { ofUrl, selectRouteParam } from 'ish-core/store/core/router';
import { loadBasket } from 'ish-core/store/customer/basket';
import { mapErrorToAction, mapToPayloadProperty, whenTruthy } from 'ish-core/utils/operators';

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
} from './order.actions';
import { getSelectedOrderId } from './order.selectors';

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
        this.camfilOrderService
          .createOrderDuplicate(orderId)
          .pipe(map(createOrderDuplicateSuccess), mapErrorToAction(createOrderDuplicateFail))
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
}
