import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { concatMap, filter, map, mapTo, mergeMap, take, tap, withLatestFrom } from 'rxjs/operators';

import { BasketService } from 'ish-core/services/basket/basket.service';
import { ApiTokenService } from 'ish-core/utils/api-token/api-token.service';
import { mapErrorToAction, mapToPayloadProperty } from 'ish-core/utils/operators';

import {
  createBasket,
  createBasketFail,
  createBasketSuccess,
  loadBasket,
  loadBasketByAPIToken,
  loadBasketEligibleShippingMethods,
  loadBasketEligibleShippingMethodsFail,
  loadBasketEligibleShippingMethodsSuccess,
  loadBasketFail,
  loadBasketSuccess,
  resetBasketErrors,
  submitBasket,
  submitBasketFail,
  submitBasketSuccess,
  updateBasket,
  updateBasketExternalOrderReference,
  updateBasketFail,
  updateBasketShippingMethod,
  validateBasket,
} from './basket.actions';
import { getCurrentBasket, getCurrentBasketId } from './basket.selectors';

@Injectable()
export class BasketEffects {
  /**
   * The load basket effect.
   */
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
  // tslint:disable-next-line:force-jsdoc-comments no-commented-out-code
  /*
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
  */
  /**
   * Delete an attribute from the basket. If the attribute doesn't exist, ignore it and return with the success action.
   */
  // tslint:disable-next-line:force-jsdoc-comments no-commented-out-code
  /*
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
  // tslint:disable-next-line:force-jsdoc-comments no-commented-out-code
  /*
  loadOrMergeBasketAfterLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loginUserSuccess),
      withLatestFrom(this.anonymousBasket$),
      switchMap(([, [sourceBasketId, sourceApiToken]]) =>
        this.basketService.getBaskets().pipe(
          switchMap(baskets => {
            if (sourceBasketId) {
              // anonymous basket exists -> get or create user basket and merge anonymous basket into it
              return iif(
                () => !!baskets.length,
                this.basketService.getBasket(),
                this.basketService.createBasket()
              ).pipe(
                switchMap(newOrCurrentUserBasket =>
                  this.basketService
                    .mergeBasket(sourceBasketId, sourceApiToken, newOrCurrentUserBasket.id)
                    .pipe(map(basket => mergeBasketSuccess({ basket })))
                ),
                mapErrorToAction(mergeBasketFail)
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
  */
  /**
   * Trigger ResetBasketErrors after the user navigated to another basket/checkout route
   * Add queryParam error=true to the route to prevent resetting errors.
   *
   */
  // tslint:disable-next-line:force-jsdoc-comments
  // We don't need to reset basket errors since we do have one-step checkout here in Camfil.
  // tslint:disable-next-line:force-jsdoc-comments no-commented-out-code
  /*
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
  */
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
  createBasket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createBasket),
      mergeMap(() =>
        this.basketService.createBasket().pipe(
          map(basket => createBasketSuccess({ basket })),
          mapErrorToAction(createBasketFail)
        )
      )
    )
  );
  /**
   * dummy effect keeping the anonymous basket with the corresponding apiToken for the basket merge call
   */
  // tslint:disable-next-line:force-jsdoc-comments no-commented-out-code
  /*
  private anonymousBasket$ = createEffect(
    () =>
      combineLatest([this.store.pipe(select(getCurrentBasketId)), this.apiTokenService.apiToken$]).pipe(
        sample(this.actions$.pipe(ofType(loginUser, loadUserByAPIToken))),
        startWith([undefined, undefined])
      ),
    { dispatch: false }
  );
 */
  validateBasketAfterLoadBasketSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadBasketSuccess),
      mapToPayloadProperty('basket'),
      take(1),
      filter(basket => !!basket?.payment?.paymentInstrument?.id),
      mapTo(validateBasket({ scopes: ['CamfilInfo'] }))
    )
  );

  constructor(
    private actions$: Actions,
    private basketService: BasketService,
    // @ts-ignore // TODO (extMlk): remove @ts-ignore when in use
    private apiTokenService: ApiTokenService,
    private router: Router,
    private store: Store
  ) {}

  /** check whether a specific custom attribute exists at basket.
   * @param basket
   * @param attributeName
   */
  // tslint:disable-next-line:force-jsdoc-comments no-commented-out-code
  /*
  private basketContainsAttribute(basketOrError: Basket, attributeName: string): boolean {
    return !!basketOrError?.attributes?.find(attr => attr.name === attributeName);
  }
  */
}
