import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { concat } from 'rxjs';
import {
  concatMap,
  debounceTime,
  defaultIfEmpty,
  filter,
  last,
  map,
  mapTo,
  mergeMap,
  reduce,
  switchMap,
  tap,
  window,
  withLatestFrom,
} from 'rxjs/operators';

import { Address } from 'ish-core/models/address/address.model';
import { Bucket } from 'ish-core/models/basket/bucket.model';
import {
  LineItemUpdateHelper,
  LineItemUpdateHelperItem,
} from 'ish-core/models/line-item-update/line-item-update.helper';
import { BasketService } from 'ish-core/services/basket/basket.service';
import { getProductEntities, loadProduct } from 'ish-core/store/shopping/products';
import { mapErrorToAction, mapToPayload, mapToPayloadProperty } from 'ish-core/utils/operators';

import {
  addBasketItemAttributes,
  addBasketItemAttributesFail,
  addBasketItemAttributesSuccess,
  addItemsToBasket,
  addItemsToBasketFail,
  addItemsToBasketSuccess,
  addProductToBasket,
  addProductToBucket,
  addProductToBucketAddressFail,
  addProductToBucketFail,
  addProductToBucketWithBasketId,
  addProductToBucketWithUrn,
  deleteBasketItem,
  deleteBasketItemAttributes,
  deleteBasketItemAttributesFail,
  deleteBasketItemAttributesSuccess,
  deleteBasketItemFail,
  deleteBasketItemSuccess,
  editBucket,
  editBucketFail,
  editBucketSuccess,
  getBasketItemAttributes,
  getBasketItemAttributesFail,
  getBasketItemAttributesSuccess,
  loadBasket,
  loadBuckets,
  loadBucketsFail,
  loadBucketsSuccess,
  updateBasketItemAttributes,
  updateBasketItemAttributesFail,
  updateBasketItemAttributesSuccess,
  updateBasketItems,
  updateBasketItemsFail,
  updateBasketItemsSuccess,
  updateBucket,
  updateBucketFail,
  updateBucketSuccess,
  validateBasket,
} from './basket.actions';
import { getCurrentBasket, getCurrentBasketId } from './basket.selectors';

const STANDARD_SHIPPING_METHOD = 'STD_GROUND';

@Injectable()
export class BasketItemsEffects {
  constructor(
    private actions$: Actions,
    private router: Router,
    private store: Store,
    private basketService: BasketService
  ) {}

  /**
   * Add a product to the current basket.
   * Triggers the internal AddItemsToBasket action that handles the actual adding of the product to the basket.
   */
  addProductToBasket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addProductToBasket),
      mapToPayload(),
      // accumulate all actions
      window(this.actions$.pipe(ofType(addProductToBasket), debounceTime(1000))),
      mergeMap(window$ =>
        window$.pipe(
          withLatestFrom(this.store.pipe(select(getProductEntities))),
          // accumulate changes
          reduce((acc, [val, entities]) => {
            const element = acc.find(x => x.sku === val.sku);
            if (element) {
              element.quantity += val.quantity;
            } else {
              acc.push({
                ...val,
                unit: entities[val.sku] && entities[val.sku].packingUnit,
                shippingMethod: val.shippingMethod,
                shipToAddress: val.shipToAddress,
              });
            }
            return acc;
          }, []),
          map(items => addItemsToBasket({ items }))
        )
      )
    )
  );

  addProductToBucketWithUrn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addProductToBucketWithUrn),
      mapToPayload(),
      concatMap(payload => [
        addProductToBasket({
          sku: payload.sku,
          quantity: payload.quantity,
          shippingMethod: payload.shippingMethod,
          shipToAddress: payload.urn,
        }),
        updateBucket({
          basketId: payload.basketId,
          addressId: payload.addressId,
          basketExtension: payload.basketExtensions,
        }),
      ])
    )
  );

  addProductToBucket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addProductToBucket),
      mapToPayload(),
      switchMap(payload => {
        if (!payload.basketId) {
          return this.basketService.createBasket().pipe(
            mergeMap(basket => [
              addProductToBucketWithBasketId({
                address: payload.address,
                shippingMethod: STANDARD_SHIPPING_METHOD,
                sku: payload.sku,
                quantity: payload.quantity,
                basketId: basket.id,
                basketExtensions: payload.basketExtensions,
              }),
            ])
          );
        }
        return [
          addProductToBucketWithBasketId({
            address: payload.address,
            shippingMethod: STANDARD_SHIPPING_METHOD,
            sku: payload.sku,
            quantity: payload.quantity,
            basketId: payload.basketId,
            basketExtensions: payload.basketExtensions,
          }),
        ];
      })
    )
  );

  addProductToBucketWithBasketId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addProductToBucketWithBasketId),
      mapToPayload(),
      mergeMap(payload =>
        this.basketService.createBasketAddress(payload.address).pipe(
          concatMap((address: Address) =>
            address && address.urn
              ? [
                  addProductToBasket({
                    sku: payload.sku,
                    quantity: payload.quantity,
                    shippingMethod: payload.shippingMethod,
                    shipToAddress: address.urn,
                  }),
                  updateBucket({
                    basketId: payload.basketId,
                    addressId: address.id,
                    basketExtension: payload.basketExtensions,
                  }),
                ]
              : [git saddProductToBucketAddressFail()]),
          mapErrorToAction(addProductToBucketFail)
        )
      )
    )
  );

  updateBucket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateBucket),
      mapToPayload(),
      mergeMap(payload =>
        this.basketService.updateBucket(payload.basketId, payload.addressId, payload.basketExtension).pipe(
          mergeMap(() => [updateBucketSuccess()]),
          mapErrorToAction(updateBucketFail)
        )
      )
    )
  );

  addItemsToBasket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addItemsToBasket),
      mapToPayload(),
      withLatestFrom(this.store.pipe(select(getCurrentBasketId))),
      concatMap(([payload, basketId]) => {
        if (basketId) {
          return this.basketService.addItemsToBasket(payload.items).pipe(
            map(info => addItemsToBasketSuccess({ info })),
            mapErrorToAction(addItemsToBasketFail)
          );
        } else {
          return this.basketService.createBasket().pipe(
            switchMap(() =>
              this.basketService.addItemsToBasket(payload.items).pipe(
                map(info => addItemsToBasketSuccess({ info })),
                mapErrorToAction(addItemsToBasketFail)
              )
            )
          );
        }
      })
    )
  );
  /**
   * Reload products when they are added to basket to update price and inStock information
   */
  loadProductsForAddItemsToBasket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addItemsToBasket),
      mapToPayload(),
      concatMap(payload => [...payload.items.map(item => loadProduct({ sku: item.sku }))])
    )
  );

  /**
   * Update basket items effect.
   * Triggers update item request if item quantity has changed and is greater zero
   * Triggers delete item request if item quantity set to zero
   */
  updateBasketItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateBasketItems),
      mapToPayload(),
      withLatestFrom(this.store.pipe(select(getCurrentBasket))),
      filter(([payload, basket]) => !!basket.lineItems && !!payload.lineItemUpdates),
      map(([{ lineItemUpdates }, { lineItems }]) =>
        LineItemUpdateHelper.filterUpdatesByItems(lineItemUpdates, lineItems as LineItemUpdateHelperItem[])
      ),
      concatMap(updates =>
        concat(
          ...updates.map(update => {
            if (update.quantity === 0) {
              return this.basketService.deleteBasketItem(update.itemId);
            } else {
              return this.basketService.updateBasketItem(update.itemId, {
                quantity: update.quantity > 0 ? { value: update.quantity, unit: update.unit } : undefined,
                product: update.sku,
              });
            }
          })
        ).pipe(
          defaultIfEmpty(),
          last(),
          map(info => updateBasketItemsSuccess({ info })),
          mapErrorToAction(updateBasketItemsFail)
        )
      )
    )
  );

  /**
   * Validates the basket after an update item error occurred
   */
  validateBasketAfterUpdateFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateBasketItemsFail),
      mapToPayload(),
      withLatestFrom(this.store.pipe(select(getCurrentBasket))),
      mapTo(validateBasket({ scopes: ['Products'] }))
    )
  );

  /**
   * Delete basket item effect.
   */
  deleteBasketItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteBasketItem),
      mapToPayloadProperty('itemId'),
      concatMap(itemId =>
        this.basketService.deleteBasketItem(itemId).pipe(
          map(info => deleteBasketItemSuccess({ info })),
          mapErrorToAction(deleteBasketItemFail)
        )
      )
    )
  );

  /**
   * Triggers a LoadBasket action after successful interaction with the Basket API.
   */
  loadBasketAfterBasketItemsChangeSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addItemsToBasketSuccess, updateBasketItemsSuccess, deleteBasketItemSuccess),
      mapToPayloadProperty('info'),
      tap(info =>
        info && info.length && info[0].message
          ? this.router.navigate(['/basket'], { queryParams: { error: true } })
          : undefined
      ),
      mapTo(loadBasket())
    )
  );

  loadBucket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadBuckets),
      mergeMap(() =>
        this.basketService.getBuckets().pipe(
          mergeMap((buckets: Bucket[]) => [loadBucketsSuccess({ buckets })]),
          mapErrorToAction(loadBucketsFail)
        )
      )
    )
  );
  // CAMFIL

  getLineItemAttributtes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getBasketItemAttributes),
      mapToPayload(),
      mergeMap(payload =>
        this.basketService
          .getLineItemAttributes(payload.basketId, payload.lineItemId, payload.bucketId)
          .pipe(map(getBasketItemAttributesSuccess), mapErrorToAction(getBasketItemAttributesFail))
      )
    )
  );

  addLineItemAttribute$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addBasketItemAttributes),
      mapToPayload(),
      mergeMap(payload =>
        this.basketService
          .addLineItemAttribute(payload.basketId, payload.lineItemId, payload.boxLabelAttribute)
          .pipe(map(addBasketItemAttributesSuccess), mapErrorToAction(addBasketItemAttributesFail))
      )
    )
  );

  updateLineItemAttributtes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateBasketItemAttributes),
      mapToPayload(),
      mergeMap(payload =>
        this.basketService
          .updateLineItemAttributes(payload.basketId, payload.lineItemId, payload.boxLabelAttribute)
          .pipe(map(updateBasketItemAttributesSuccess), mapErrorToAction(updateBasketItemAttributesFail))
      )
    )
  );

  deleteLineItemAttributte$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteBasketItemAttributes),
      mapToPayload(),
      mergeMap(payload =>
        this.basketService
          .deleteLineItemAttributes(payload.basketId, payload.lineItemId, payload.bucketId, payload.attributeName)
          .pipe(map(deleteBasketItemAttributesSuccess), mapErrorToAction(deleteBasketItemAttributesFail))
      )
    )
  );
}
