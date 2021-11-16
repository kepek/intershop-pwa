import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { RouterNavigatedPayload, routerNavigatedAction } from '@ngrx/router-store';
import { Store, select } from '@ngrx/store';
import { EMPTY, combineLatest, iif, of } from 'rxjs';
import {
  concatMap,
  concatMapTo,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  mapTo,
  mergeMap,
  sample,
  startWith,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';

import { Basket } from 'ish-core/models/basket/basket.model';
import { BasketService } from 'ish-core/services/basket/basket.service';
import { RouterState } from 'ish-core/store/core/router/router.reducer';
import { setCheckoutFocusedElement } from 'ish-core/store/core/viewconf/viewconf.actions';
import { createUser, loadUserByAPIToken, loginUser, loginUserSuccess } from 'ish-core/store/customer/user';
import { ApiTokenService } from 'ish-core/utils/api-token/api-token.service';
import { mapErrorToAction, mapToPayload, mapToPayloadProperty } from 'ish-core/utils/operators';

import {
  camfilDragLineItem,
  camfilDragLineItemFail,
  camfilDragLineItemSuccess,
  checkCurrentBasket,
  createBasket,
  deleteBasketAttribute,
  deleteBasketAttributeFail,
  deleteBasketAttributeSuccess,
  focusedCheckoutElement,
  getWarehouseCalendar,
  getWarehouseCalendarSuccess,
  loadBasket,
  loadBasketByAPIToken,
  loadBasketEligibleShippingMethods,
  loadBasketEligibleShippingMethodsFail,
  loadBasketEligibleShippingMethodsSuccess,
  loadBasketFail,
  loadBasketSuccess,
  loadBuckets,
  loadCustomerDeliveryTerm,
  loadCustomerDeliveryTermFail,
  loadCustomerDeliveryTermSuccess,
  resetBasketErrors,
  setBasketAttribute,
  setBasketAttributeFail,
  setBasketAttributeSuccess,
  submitBasket,
  submitBasketFail,
  submitBasketSuccess,
  updateBasket,
  updateBasketExternalOrderReference,
  updateBasketFail,
  updateBasketShippingMethod,
} from './basket.actions';
import {
  getCurrentBasket,
  getCurrentBasketId,
  getCustomersDeliveryTerms,
  getSubmittedBasket,
} from './basket.selectors';

@Injectable()
export class BasketEffects {
  /**
   * The load basket effect.
   */
  loadBasket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadBasket),
      mergeMap(() =>
        this.basketService.getBasket().pipe(
          map(basket => loadBasketSuccess({ basket })),
          mapErrorToAction(loadBasketFail)
        )
      )
    )
  );
  loadBasketSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadBasketSuccess),
      mergeMap(() => [loadBuckets()])
    )
  );
  loadBasketByAPIToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadBasketByAPIToken),
      mapToPayloadProperty('apiToken'),
      concatMap(apiToken =>
        this.basketService.getBasketByToken(apiToken).pipe(map(basket => loadBasketSuccess({ basket })))
      )
    )
  );
  /**
   * The load basket eligible shipping methods effect.
   */
  loadBasketEligibleShippingMethods$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadBasketEligibleShippingMethods),
      withLatestFrom(this.store.pipe(select(getCurrentBasket))),
      concatMap(([, basket]) =>
        this.basketService.getBasketEligibleShippingMethods(basket.bucketId).pipe(
          map(result => loadBasketEligibleShippingMethodsSuccess({ shippingMethods: result })),
          mapErrorToAction(loadBasketEligibleShippingMethodsFail)
        )
      )
    )
  );
  /**
   * Update basket effect.
   */
  updateBasket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateBasket),
      mapToPayloadProperty('update'),
      concatMap(update =>
        this.basketService.updateBasket(update).pipe(
          concatMap(basket => [loadBasketSuccess({ basket }), resetBasketErrors()]),
          mapErrorToAction(updateBasketFail)
        )
      )
    )
  );
  /**
   * Updates the common shipping method of the basket.
   * Works currently only if the basket has one bucket
   */
  updateBasketShippingMethod$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateBasketShippingMethod),
      mapToPayloadProperty('shippingId'),
      map(commonShippingMethod => updateBasket({ update: { commonShippingMethod } }))
    )
  );
  /**
   * Updates the order reference of the basket.
   */
  updateBasketExternalOrderReference$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateBasketExternalOrderReference),
      mapToPayloadProperty('externalOrderReference'),
      map(externalOrderReference => updateBasket({ update: { externalOrderReference } }))
    )
  );
  /**
   * Add or update an attribute at the basket.
   */
  setCustomAttributeToBasket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(setBasketAttribute),
      mapToPayloadProperty('attribute'),
      withLatestFrom(this.store.pipe(select(getCurrentBasket))),
      mergeMap(([attr, basket]) =>
        (this.basketContainsAttribute(basket, attr.name)
          ? this.basketService.updateBasketAttribute(attr)
          : this.basketService.createBasketAttribute(attr)
        ).pipe(concatMapTo([setBasketAttributeSuccess(), loadBasket()]), mapErrorToAction(setBasketAttributeFail))
      )
    )
  );
  /**
   * Delete an attribute from the basket. If the attribute doesn't exist, ignore it and return with the success action.
   */
  deleteCustomAttributeFromBasket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteBasketAttribute),
      mapToPayloadProperty('attributeName'),
      withLatestFrom(this.store.pipe(select(getCurrentBasket))),
      mergeMap(([name, basket]) =>
        this.basketContainsAttribute(basket, name)
          ? this.basketService
              .deleteBasketAttribute(name)
              .pipe(
                concatMapTo([deleteBasketAttributeSuccess(), loadBasket()]),
                mapErrorToAction(deleteBasketAttributeFail)
              )
          : [deleteBasketAttributeSuccess()]
      )
    )
  );
  /**
   * loading and handling merges of the users baskets, when the user logs in
   */
  loadOrMergeBasketAfterLogin$ = createEffect(() =>
    this.actions$.pipe(ofType(loginUserSuccess), map(checkCurrentBasket))
  );
  /**
   * Trigger ResetBasketErrors after the user navigated to another basket/checkout route
   * Add queryParam error=true to the route to prevent resetting errors.
   *
   */
  routeListenerForResettingBasketErrors$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigatedAction),
      mapToPayloadProperty<RouterNavigatedPayload<RouterState>>('routerState'),
      filter(
        (routerState: RouterState) => /^\/(basket|checkout.*)/.test(routerState.url) && !routerState.queryParams?.error
      ),
      mapTo(resetBasketErrors())
    )
  );
  /**
   * Creates a requisition based on the given basket, if approval is required
   */
  createRequisition$ = createEffect(() =>
    this.actions$.pipe(
      ofType(submitBasket),
      withLatestFrom(this.store.select(getCurrentBasketId)),
      concatMap(([, basketId]) =>
        this.basketService.createRequisition(basketId).pipe(
          tap(() => this.router.navigate(['/checkout/receipt'])),
          map(submitBasketSuccess),
          mapErrorToAction(submitBasketFail)
        )
      )
    )
  );
  camfilDragLineItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(camfilDragLineItem),
      mapToPayload(),
      mergeMap(payload =>
        this.basketService.camfilDragLineItem(payload.basketId, payload.updatedLineItem, payload.targetBucket).pipe(
          mergeMap(updatedBasket => [camfilDragLineItemSuccess({ updatedBasket }), loadBuckets()]),
          mapErrorToAction(camfilDragLineItemFail)
        )
      )
    )
  );
  loadCustomerDeliveryTerm$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCustomerDeliveryTerm),
      mapToPayload(),
      withLatestFrom(this.store.select(getCustomersDeliveryTerms)),
      filter(([{ customerId }, terms]) => !terms[customerId]),
      concatMap(([{ customerId }]) =>
        this.basketService.loadCustomerDeliveryTerm(customerId).pipe(
          mergeMap(term => [loadCustomerDeliveryTermSuccess({ customerId, term })]),
          mapErrorToAction(loadCustomerDeliveryTermFail)
        )
      )
    )
  );
  createBasket$ = createEffect(() => this.actions$.pipe(ofType(createBasket), map(checkCurrentBasket)));

  // CAMFIL
  getWarehouseCalendar$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getWarehouseCalendar),
      mergeMap(() =>
        this.basketService.getWarehouseCalendar().pipe(
          map((dates: []) => getWarehouseCalendarSuccess({ dates })),
          mapErrorToAction(loadBasketFail)
        )
      )
    )
  );
  setCheckoutFocusedElement$ = createEffect(() =>
    this.actions$.pipe(
      ofType(focusedCheckoutElement),
      debounceTime(300),
      distinctUntilChanged(),
      mapToPayload(),
      map(setCheckoutFocusedElement)
    )
  );
  /**
   * dummy effect keeping the anonymous basket with the corresponding apiToken for the basket merge call
   */
  private anonymousBasket$ = createEffect(
    () =>
      combineLatest([this.store.pipe(select(getCurrentBasketId)), this.apiTokenService.apiToken$]).pipe(
        sample(this.actions$.pipe(ofType(loginUser, createUser, loadUserByAPIToken))),
        startWith([undefined, undefined])
      ),
    { dispatch: false }
  );
  checkCurrentBasket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(checkCurrentBasket),
      withLatestFrom(this.anonymousBasket$),
      switchMap(([, [sourceBasketId]]) =>
        this.basketService.getBaskets().pipe(
          switchMap(baskets => {
            if (sourceBasketId) {
              // anonymous basket exists -> get or create user basket and merge anonymous basket into it
              return iif(
                () => !!baskets.length,
                this.basketService.getBasket(),
                this.basketService.createBasket()
              ).pipe(
                map(basket => loadBasketSuccess({ basket })),
                mapErrorToAction(loadBasketFail)
              );
            } else if (baskets.length) {
              // no anonymous basket exists and user already has a basket -> load it
              return of(loadBasket());
            } else {
              // no anonymous or user basket -> do nothing
              return EMPTY;
            }
          })
        )
      )
    )
  );

  createBasketWhenLeavingCheckoutConfirmationPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigatedAction),
      mapToPayloadProperty<RouterNavigatedPayload<RouterState>>('routerState'),
      filter(
        (routerState: RouterState) => !/^\/(basket|checkout.*)/.test(routerState.url) && !routerState.queryParams?.error
      ),
      withLatestFrom(this.store.pipe(select(getSubmittedBasket)), this.store.pipe(select(getCurrentBasketId))),
      filter(([, submittedBasket, basket]) => !!submittedBasket && !basket),
      map(createBasket)
    )
  );

  constructor(
    private actions$: Actions,
    private basketService: BasketService,
    private apiTokenService: ApiTokenService,
    private router: Router,
    private store: Store
  ) {}

  /** check whether a specific custom attribute exists at basket.
   * @param basket
   * @param attributeName
   */
  private basketContainsAttribute(basket: Basket, attributeName: string): boolean {
    return !!basket?.attributes?.find(attr => attr.name === attributeName);
  }
}
