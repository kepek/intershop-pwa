import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { routerNavigatedAction } from '@ngrx/router-store';
import { Store, select } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { isEqual } from 'lodash-es';
import { iif, race } from 'rxjs';
import {
  concatMap,
  distinctUntilChanged,
  filter,
  map,
  mapTo,
  mergeMap,
  switchMap,
  switchMapTo,
  take,
  tap,
  withLatestFrom,
} from 'rxjs/operators';

import { OrderService } from 'ish-core/services/order/order.service';
import { displayErrorMessage, displaySuccessMessage } from 'ish-core/store/core/messages';
import { ofUrl, selectQueryParams, selectRouteParam } from 'ish-core/store/core/router';
import { setBreadcrumbData } from 'ish-core/store/core/viewconf';
import {
  continueCheckoutWithIssues,
  getCurrentBasketId,
  getSubmittedBasket,
  loadBasket,
} from 'ish-core/store/customer/basket';
import { getLoggedInUser } from 'ish-core/store/customer/user';
import { mapErrorToAction, mapToPayload, mapToPayloadProperty, whenTruthy } from 'ish-core/utils/operators';

import { TrackingService } from '../../../../extensions/tracking/services/tracking.service';

import {
  createOrder,
  createOrderFail,
  createOrderSuccess,
  loadOrder,
  loadOrderByAPIToken,
  loadOrderFail,
  loadOrderSuccess,
  loadOrders,
  loadOrdersFail,
  loadOrdersSuccess,
  selectOrder,
  selectOrderAfterRedirect,
  selectOrderAfterRedirectFail,
} from './orders.actions';
import { getOrder, getSelectedOrder, getSelectedOrderId } from './orders.selectors';

@Injectable()
export class OrdersEffects {
  /**
   * Creates an order based on the given basket.
   */
  createOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createOrder),
      withLatestFrom(this.store.select(getCurrentBasketId)),
      mergeMap(([, basketId]) => {
        const erpEmployeeId = localStorage?.getItem('erpEmployeeId');

        let createOrder$ = this.orderService.createOrder(basketId, true);

        if (erpEmployeeId) {
          createOrder$ = this.orderService.createOrder(basketId, true, erpEmployeeId);
        }

        return createOrder$.pipe(
          map(order => createOrderSuccess({ order })),
          mapErrorToAction(createOrderFail)
        );
      })
    )
  );
  /**
   * After order creation either redirect to a payment provider or show checkout receipt page.
   */
  continueAfterOrderCreation$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(createOrderSuccess),
        mapToPayloadProperty('order'),
        filter(order => !order || !order.orderCreation || order.orderCreation.status !== 'ROLLED_BACK'),
        tap(order => {
          if (
            order.orderCreation &&
            order.orderCreation.status === 'STOPPED' &&
            order.orderCreation.stopAction.type === 'Redirect' &&
            order.orderCreation.stopAction.redirectUrl
          ) {
            location.assign(order.orderCreation.stopAction.redirectUrl);
          } else {
            this.router.navigate(['/checkout/receipt']); // we need to disable this action because of custom checkout behaviour in Camfil
          }
        })
      ),
    { dispatch: false }
  );
  rollbackAfterOrderCreation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createOrderSuccess),
      mapToPayloadProperty('order'),
      filter(order => order.orderCreation && order.orderCreation.status === 'ROLLED_BACK'),
      tap(() => this.router.navigate(['/checkout/payment'], { queryParams: { error: true } })),
      concatMap(order => [
        loadBasket(),
        continueCheckoutWithIssues({
          targetRoute: undefined,
          basketValidation: {
            basket: undefined,
            results: {
              valid: false,
              adjusted: false,
              errors: order.infos,
            },
          },
        }),
      ])
    )
  );
  loadOrders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadOrders),
      concatMap(() =>
        this.orderService.getOrders().pipe(
          map(orders => loadOrdersSuccess({ orders })),
          mapErrorToAction(loadOrdersFail)
        )
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
  loadOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadOrder),
      mapToPayloadProperty('orderId'),
      concatMap(orderId =>
        this.orderService.getOrder(orderId).pipe(
          map(order => loadOrderSuccess({ order })),
          mapErrorToAction(loadOrderFail)
        )
      )
    )
  );
  /**
   * Loads an anonymous user`s order using the given api token and orderId.
   */
  loadOrderByAPIToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadOrderByAPIToken),
      mapToPayload(),
      concatMap(payload =>
        this.orderService.getOrderByToken(payload.orderId, payload.apiToken).pipe(
          map(order => loadOrderSuccess({ order })),
          mapErrorToAction(loadOrderFail)
        )
      )
    )
  );
  /**
   * Selects and loads an order.
   */
  loadOrderForSelectedOrder$ = createEffect(() =>
    iif(
      () => isPlatformBrowser(this.platformId),
      this.actions$.pipe(
        ofType(selectOrder),
        mapToPayloadProperty('orderId'),
        whenTruthy(),
        map(orderId => loadOrder({ orderId }))
      )
    )
  );
  /**
   * Triggers a SelectOrder action if route contains orderId parameter ( for order detail page ).
   */
  routeListenerForSelectingOrder$ = createEffect(() =>
    this.store.pipe(
      // ofUrl(/^\/(account\/orders.*|checkout\/receipt)/), // CAM-1018
      ofUrl(/^\/checkout\/receipt/),
      select(selectRouteParam('orderId')),
      withLatestFrom(this.store.pipe(select(getSelectedOrderId))),
      filter(([fromAction, selectedOrderId]) => fromAction && fromAction !== selectedOrderId),
      map(([orderId]) => orderId),
      map(orderId => selectOrder({ orderId }))
    )
  );
  /**
   * Returning from redirect after checkout (before customer is logged in).
   * Waits until the customer is logged in and triggers the handleOrderAfterRedirect action afterwards.
   */
  returnFromRedirectAfterOrderCreation$ = createEffect(() =>
    this.store.pipe(
      ofUrl(/^\/checkout\/(receipt|payment)/),
      select(selectQueryParams),
      filter(({ redirect, orderId }) => redirect && orderId),
      distinctUntilChanged(isEqual),
      switchMap(queryParams =>
        // SelectOrderAfterRedirect will be triggered either after a user is logged in or after the paid order is loaded (anonymous user)
        race([
          this.store.pipe(select(getLoggedInUser), whenTruthy(), take(1)),
          this.store.pipe(select(getOrder, { orderId: queryParams.orderId }), whenTruthy(), take(1)),
        ]).pipe(mapTo(selectOrderAfterRedirect({ params: queryParams })))
      )
    )
  );
  /**
   * Returning from redirect after checkout success case (after customer is logged in).
   * Sends success state with payment query params to the server and selects/loads order.
   */
  selectOrderAfterRedirect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(selectOrderAfterRedirect),
      mapToPayloadProperty('params'),
      concatMap(params =>
        this.orderService.updateOrderPayment(params.orderId, params).pipe(
          map(orderId => {
            if (params.redirect === 'success') {
              return selectOrder({ orderId });
            } else {
              return loadBasket();
            }
          }),
          mapErrorToAction(selectOrderAfterRedirectFail) // ToDo: display error message on receipt page
        )
      )
    )
  );
  selectOrderAfterRedirectFailed$ = createEffect(() =>
    this.actions$.pipe(
      ofType(selectOrderAfterRedirectFail),
      tap(() =>
        this.router.navigate(['/checkout/payment'], {
          queryParams: { redirect: 'failure' },
        })
      ),
      mapTo(loadBasket())
    )
  );
  setOrderBreadcrumb$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigatedAction),
      switchMapTo(
        this.store.pipe(
          ofUrl(/^\/account\/orders\/.*/),
          select(getSelectedOrder),
          whenTruthy(),
          map(order =>
            setBreadcrumbData({
              breadcrumbData: [
                { key: 'account.order_history.link', link: '/account/orders' },
                { text: `${this.translateService.instant('account.orderdetails.breadcrumb')} - ${order.documentNo}` },
              ],
            })
          )
        )
      )
    )
  );

  trackOrder$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(createOrderSuccess),
        withLatestFrom(this.store.select(getSubmittedBasket)),
        map(([, submittedBasket]) => submittedBasket),
        whenTruthy(),
        tap(submittedBasket => this.trackingService.trackOrder(submittedBasket))
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private orderService: OrderService,
    private trackingService: TrackingService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: string,
    private store: Store,
    private translateService: TranslateService
  ) {}
}
