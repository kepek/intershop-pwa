import { isPlatformBrowser } from '@angular/common';
import { Injectable } from '@angular/core';
import { createEffect, ofType } from '@ngrx/effects';
import { select } from '@ngrx/store';
import { loadCamfilOrderIfNotLoaded } from 'camfil-pwa/store/camfil-orders';
import { loadOrderIfNotLoaded } from 'camfil-pwa/store/customer/orders/orders.actions';
import { getOrderEntities } from 'camfil-pwa/store/customer/orders/orders.selectors';
import { identity, iif } from 'rxjs';
import { filter, groupBy, map, mergeMap, throttleTime, withLatestFrom } from 'rxjs/operators';

import { displayErrorMessage, displaySuccessMessage } from 'ish-core/store/core/messages';
import { ofUrl, selectRouteParam } from 'ish-core/store/core/router';
import {
  createOrderFail,
  createOrderSuccess,
  getSelectedOrderId,
  loadOrder,
  loadOrderSuccess,
  selectOrder,
} from 'ish-core/store/customer/orders';
import { OrdersEffects as IshOrderEffects } from 'ish-core/store/customer/orders/orders.effects';
import { mapToPayload, mapToPayloadProperty, whenTruthy } from 'ish-core/utils/operators';

@Injectable()
export class OrdersEffects extends IshOrderEffects {
  loadOrderIfNotLoaded$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadOrderIfNotLoaded),
      mapToPayload(),
      withLatestFrom(this.store.pipe(select(getOrderEntities))),
      filter(([{ orderId }, entities]) => !entities?.[orderId]),
      groupBy(([{ orderId }]) => orderId),
      mergeMap(group$ =>
        group$.pipe(
          this.throttleOnBrowser(),
          map(([{ orderId }]) => loadOrder({ orderId }))
        )
      )
    )
  );

  loadOrderSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadOrderSuccess),
      mapToPayloadProperty('order'),
      whenTruthy(),
      map(order => loadCamfilOrderIfNotLoaded({ orderId: order.camfilOrderUUID }))
    )
  );

  routeListenerForSelectingOrder$ = createEffect(() =>
    this.store.pipe(
      ofUrl(/^\/checkout\/receipt/),
      select(selectRouteParam('orderId')),
      withLatestFrom(this.store.pipe(select(getSelectedOrderId))),
      filter(([fromAction, selectedOrderId]) => fromAction && fromAction !== selectedOrderId),
      map(([orderId]) => orderId),
      map(orderId => selectOrder({ orderId }))
    )
  );

  loadCamfilOrderAfterIshOrderCreation$ = createEffect(() =>
    iif(
      () => isPlatformBrowser(this.platformId),
      this.actions$.pipe(
        ofType(createOrderSuccess),
        mapToPayloadProperty('order'),
        map(order => order?.camfilOrderUUID),
        whenTruthy(),
        mergeMap(orderId => [loadCamfilOrderIfNotLoaded({ orderId })])
      )
    )
  );

  notificationAfterOrderCreation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createOrderSuccess),
      map(() =>
        displaySuccessMessage({
          message: 'camfil.checkout.message.order_created',
        })
      )
    )
  );

  notificationAfterOrderCreationError$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createOrderFail),
      map(() =>
        displayErrorMessage({
          message: 'camfil.checkout.message.order_failed',
        })
      )
    )
  );

  private throttleOnBrowser() {
    return isPlatformBrowser(this.platformId) && this.router.navigated ? throttleTime(100) : map(identity);
  }
}
