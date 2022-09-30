import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { routerNavigationAction } from '@ngrx/router-store';
import { Store, select } from '@ngrx/store';
import { IshBasketService } from 'camfil-pwa/services/ish-basket/ish-basket.service';
import { EMPTY, iif, of } from 'rxjs';
import {
  concatMap,
  concatMapTo,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  mapTo,
  mergeMap,
  shareReplay,
  startWith,
  switchMap,
  withLatestFrom,
} from 'rxjs/operators';

import { Address } from 'ish-core/models/address/address.model';
import { Basket } from 'ish-core/models/basket/basket.model';
import { Bucket } from 'ish-core/models/bucket/bucket.model';
import { BasketService } from 'ish-core/services/basket/basket.service';
import { displayErrorMessage, displaySuccessMessage } from 'ish-core/store/core/messages';
import { setCheckoutFocusedElement } from 'ish-core/store/core/viewconf';
import {
  addProductToBasket,
  addProductToBucket,
  addProductToBucketAddressFail,
  addProductToBucketAddressFromCamCardFail,
  addProductToBucketFail,
  addProductToBucketWithBasketId,
  addProductToBucketWithUrn,
  addProductsFromCamCard,
  addProductsFromCamCardFail,
  addProductsToBasketFromCamCard,
  camfilDragLineItem,
  camfilDragLineItemFail,
  camfilDragLineItemSuccess,
  createBasketFail,
  createBasketSuccess,
  deleteBasketAttribute,
  deleteBasketAttributeFail,
  deleteBasketAttributeSuccess,
  deleteBucket,
  deleteBucketFail,
  deleteBucketSuccess,
  focusedCheckoutElement,
  getCurrentBasket,
  getCustomersDeliveryTerms,
  getWarehouseCalendar,
  getWarehouseCalendarSuccess,
  loadBasket,
  loadBasketAddresses,
  loadBasketFail,
  loadBasketSuccess,
  loadCustomerDeliveryTerm,
  loadCustomerDeliveryTermFail,
  loadCustomerDeliveryTermSuccess,
  setBasketAttribute,
  setBasketAttributeFail,
  setBasketAttributeSuccess,
  updateBasket,
} from 'ish-core/store/customer/basket';
import { BasketEffects } from 'ish-core/store/customer/basket/basket.effects';
import { getLoggedInCustomer } from 'ish-core/store/customer/user';
import { loginUserSuccess } from 'ish-core/store/customer/user/user.actions';
import { ApiTokenService } from 'ish-core/utils/api-token/api-token.service';
import { mapErrorToAction, mapToPayload, mapToPayloadProperty, mapToProperty } from 'ish-core/utils/operators';

import { deleteBasket, loadBuckets, loadBucketsFail, loadBucketsSuccess, reloadBasket } from './ish-basket.actions';
import { getCalculatedBasket } from './ish-basket.selectors';

export const STANDARD_SHIPPING_METHOD = 'STD_GROUND';

export const EMPTY_BUCKET_PREFIX = 'emptyBucket';

@Injectable()
export class IshBasketEffects extends BasketEffects {
  constructor(
    actions$: Actions,
    basketService: BasketService,
    apiTokenService: ApiTokenService,
    router: Router,
    store: Store,
    private ishActions$: Actions,
    private ishBasketService: IshBasketService,
    private ishApiTokenService: ApiTokenService,
    private ishStore: Store
  ) {
    super(actions$, basketService, apiTokenService, router, store);
  }
  protected ishAnonymousBasket$ = createEffect(
    () =>
      this.ishStore.pipe(
        // track basket changes
        select(getCurrentBasket),
        mapToProperty('id'),
        // append corresponding apiToken and customer
        withLatestFrom(this.ishApiTokenService.apiToken$, this.ishStore.pipe(select(getLoggedInCustomer))),
        // don't emit when there is a customer
        filter(([, , customer]) => !customer),
        startWith([]),
        shareReplay(1)
      ),
    { dispatch: false }
  );
  loadBuckets$ = createEffect(() =>
    this.ishActions$.pipe(
      ofType(loadBuckets),
      mapToPayloadProperty('basket'),
      mergeMap(basket =>
        this.ishBasketService.getBuckets(basket).pipe(
          mergeMap((buckets: Bucket[]) => [loadBucketsSuccess({ buckets })]),
          mapErrorToAction(loadBucketsFail)
        )
      )
    )
  );
  loadBucketsAfterLoadBasketSuccess$ = createEffect(() =>
    this.ishActions$.pipe(
      ofType(loadBasketSuccess),
      mapToPayloadProperty('basket'),
      map(basket => loadBuckets({ basket }))
    )
  );
  reloadBasket$ = createEffect(() =>
    this.ishActions$.pipe(
      ofType(reloadBasket),
      mergeMap(() =>
        this.ishBasketService.reloadBasket().pipe(
          map(basket => loadBasketSuccess({ basket })),
          mapErrorToAction(loadBasketFail)
        )
      )
    )
  );
  getWarehouseCalendar$ = createEffect(() =>
    this.ishActions$.pipe(
      ofType(getWarehouseCalendar),
      mergeMap(() =>
        this.ishBasketService.getWarehouseCalendar().pipe(
          map((dates: []) => getWarehouseCalendarSuccess({ dates })),
          mapErrorToAction(loadBasketFail)
        )
      )
    )
  );
  setCustomAttributeToBasket$ = createEffect(() =>
    this.ishActions$.pipe(
      ofType(setBasketAttribute),
      mapToPayloadProperty('attribute'),
      withLatestFrom(this.ishStore.pipe(select(getCurrentBasket))),
      mergeMap(([attr, basket]) =>
        (this.ishBasketContainsAttribute(basket, attr.name)
          ? this.ishBasketService.updateBasketAttribute(attr)
          : this.ishBasketService.createBasketAttribute(attr)
        ).pipe(
          mergeMap(() => [setBasketAttributeSuccess(), reloadBasket()]),
          mapErrorToAction(setBasketAttributeFail)
        )
      )
    )
  );
  setCheckoutFocusedElement$ = createEffect(() =>
    this.ishActions$.pipe(
      ofType(focusedCheckoutElement),
      mapToPayloadProperty('elementId'),
      debounceTime(400),
      distinctUntilChanged(),
      filter(elementId => elementId !== ''),
      map(elementId => setCheckoutFocusedElement({ elementId }))
    )
  );
  deleteCustomAttributeFromBasket$ = createEffect(() =>
    this.ishActions$.pipe(
      ofType(deleteBasketAttribute),
      mapToPayloadProperty('attributeName'),
      withLatestFrom(this.ishStore.pipe(select(getCurrentBasket))),
      mergeMap(([name, basket]) =>
        this.ishBasketContainsAttribute(basket, name)
          ? this.ishBasketService
              .deleteBasketAttribute(name)
              .pipe(
                concatMapTo([deleteBasketAttributeSuccess(), reloadBasket()]),
                mapErrorToAction(deleteBasketAttributeFail)
              )
          : [deleteBasketAttributeSuccess()]
      )
    )
  );
  camfilDragLineItem$ = createEffect(() =>
    this.ishActions$.pipe(
      ofType(camfilDragLineItem),
      mapToPayload(),
      mergeMap(payload =>
        this.ishBasketService.camfilDragLineItem(payload.basketId, payload.updatedLineItem, payload.targetBucket).pipe(
          mergeMap(updatedBasket => [camfilDragLineItemSuccess({ updatedBasket })]),
          mapErrorToAction(camfilDragLineItemFail)
        )
      )
    )
  );
  loadOrMergeBasketAfterLogin$ = createEffect(() =>
    this.ishActions$.pipe(
      ofType(loginUserSuccess),
      withLatestFrom(this.ishAnonymousBasket$),
      switchMap(([, [sourceBasketId]]) =>
        this.ishBasketService.getBaskets().pipe(
          withLatestFrom(this.ishStore.select(getCurrentBasket)),
          switchMap(([baskets, current]) => {
            if (sourceBasketId) {
              // anonymous basket exists -> get or create user basket and merge anonymous basket into it
              return current
                ? EMPTY
                : iif(
                    () => !!baskets.length,
                    this.ishBasketService.getBasket(),
                    this.ishBasketService.createBasket()
                  ).pipe(
                    map(basket => loadBasketSuccess({ basket })),
                    mapErrorToAction(loadBasketFail)
                  );
            } else if (baskets.length) {
              // basket exists and user (both logged in & anonymous) already has a basket -> load it
              return current ? EMPTY : of(loadBasket());
            } else {
              // is logged user but does not have basket -> create basket
              return this.ishBasketService.createBasket().pipe(
                map(basket => createBasketSuccess({ basket })),
                mapErrorToAction(createBasketFail)
              );
            }
          })
        )
      )
    )
  );
  addProductToBucket$ = createEffect(() =>
    this.ishActions$.pipe(
      ofType(addProductToBucket),
      mapToPayload(),
      mergeMap(({ address, sku, quantity, basketId, basketExtension, lineItemAttributes, bucketId }) => {
        const addProduct = (id = basketId) =>
          addProductToBucketWithBasketId({
            address,
            shippingMethod: STANDARD_SHIPPING_METHOD,
            sku,
            quantity,
            basketId: id,
            basketExtension,
            lineItemAttributes,
            bucketId,
          });
        return basketId
          ? [addProduct()]
          : this.ishBasketService
              .createBasket()
              .pipe(mergeMap(basket => [loadBasketSuccess({ basket }), addProduct(basket.id)]));
      })
    )
  );
  deleteBucket$ = createEffect(() =>
    this.ishActions$.pipe(
      ofType(deleteBucket),
      mapToPayload(),
      concatMap(payload =>
        this.ishBasketService
          .deleteBucket(payload.basketId, payload.bucketId)
          .pipe(map(deleteBucketSuccess), mapErrorToAction(deleteBucketFail))
      )
    )
  );
  deleteBucketSuccess$ = createEffect(() =>
    this.ishActions$.pipe(
      ofType(deleteBucketSuccess),
      map(() =>
        displaySuccessMessage({
          message: 'camfil.order_delete.confirmation',
        })
      )
    )
  );
  deleteBasket$ = createEffect(() =>
    this.ishActions$.pipe(
      ofType(deleteBasket),
      mapToPayload(),
      concatMap(payload =>
        this.ishBasketService.deleteBasket(payload.basketId).pipe(
          map(() =>
            displaySuccessMessage({
              message: `camfil delete Basket ${payload.basketId} confirmation - !RELOAD PAGE!`,
            })
          ),
          mapErrorToAction(() =>
            displayErrorMessage({
              message: 'deleteBasket error',
            })
          )
        )
      )
    )
  );
  addProductToBucketWithUrn$ = createEffect(() =>
    this.ishActions$.pipe(
      ofType(addProductToBucketWithUrn),
      mapToPayload(),
      concatMap(payload => [
        addProductToBasket({
          sku: payload.sku,
          quantity: payload.quantity,
          shippingMethod: payload.shippingMethod,
          shipToAddress: payload.urn,
          addressId: payload.addressId,
          lineItemAttributes: payload.lineItemAttributes,
        }),
      ])
    )
  );
  addProductToBucketWithBasketId$ = createEffect(() =>
    this.ishActions$.pipe(
      ofType(addProductToBucketWithBasketId),
      mapToPayload(),
      mergeMap(payload =>
        this.ishBasketService.createBasketAddress(payload.address).pipe(
          concatMap((address: Address) =>
            address && address.urn
              ? [
                  addProductToBasket({
                    sku: payload.sku,
                    quantity: payload.quantity,
                    shippingMethod: payload.shippingMethod,
                    shipToAddress: address.urn,
                    basketExtension: payload.basketExtension,
                    addressId: address.id,
                    lineItemAttributes: payload.lineItemAttributes,
                    bucketId: payload.bucketId,
                  }),
                  loadBasketAddresses(),
                ]
              : [addProductToBucketAddressFail()]
          ),
          mapErrorToAction(addProductToBucketFail)
        )
      )
    )
  );
  addProductsFromCamCard$ = createEffect(() =>
    this.ishActions$.pipe(
      ofType(addProductsFromCamCard),
      mapToPayload(),
      mergeMap(payload =>
        this.ishBasketService.createBasketAddress(payload.itemsInfo.address).pipe(
          concatMap((address: Address) => {
            const products = payload.itemsInfo.products;
            return address && address.urn
              ? [
                  addProductsToBasketFromCamCard({
                    products,
                    shippingMethod: payload.commonShippingMethodId,
                    shipToAddress: address.urn,
                    basketExtension: payload.itemsInfo.extensions,
                    addressId: address.id,
                    camCardName: payload.camCardName,
                  }),
                ]
              : [addProductToBucketAddressFromCamCardFail()];
          }),
          mapErrorToAction(addProductsFromCamCardFail)
        )
      )
    )
  );
  loadCustomerDeliveryTerm$ = createEffect(() =>
    this.ishActions$.pipe(
      ofType(loadCustomerDeliveryTerm),
      mapToPayload(),
      withLatestFrom(this.ishStore.select(getCustomersDeliveryTerms)),
      filter(([{ customerId }, terms]) => !terms[customerId]),
      concatMap(([{ customerId }]) =>
        this.ishBasketService.loadCustomerDeliveryTerm(customerId).pipe(
          mergeMap(term => [loadCustomerDeliveryTermSuccess({ customerId, term })]),
          mapErrorToAction(loadCustomerDeliveryTermFail)
        )
      )
    )
  );

  updateCalculatedBasket$ = createEffect(() =>
    this.ishActions$.pipe(
      ofType(routerNavigationAction),
      mapToPayloadProperty('routerState'),
      filter(routerState => routerState.url === '/checkout/onestep'),
      withLatestFrom(this.ishStore.select(getCalculatedBasket)),
      filter(([, calculated]) => !calculated),
      mapTo(updateBasket({ update: { calculated: true } }))
    )
  );
  protected ishBasketContainsAttribute(basketOrError: Basket, attributeName: string): boolean {
    return !!basketOrError?.attributes?.find(attr => attr.name === attributeName);
  }
}
