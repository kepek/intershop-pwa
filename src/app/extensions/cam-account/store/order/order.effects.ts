import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatMap, map } from 'rxjs/operators';

import { mapErrorToAction, mapToPayloadProperty } from 'ish-core/utils/operators';

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
} from './order.actions';

@Injectable()
export class OrderEffects {
  constructor(private actions$: Actions, private camfilOrderService: OrderService) {}

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
        this.camfilOrderService.getOrderTrackAndTrace(orderId).pipe(
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
          map(createdOrder => createOrderDuplicateSuccess({ orderId, createdOrder })),
          mapErrorToAction(createOrderDuplicateFail)
        )
      )
    )
  );
}
