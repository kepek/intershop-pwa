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
  tap,
  window,
  withLatestFrom,
} from 'rxjs/operators';

import { Address } from 'ish-core/models/address/address.model';
import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { Bucket } from 'ish-core/models/basket/bucket.model';
import {
  LineItemUpdateHelper,
  LineItemUpdateHelperItem,
} from 'ish-core/models/line-item-update/line-item-update.helper';
import { BasketService } from 'ish-core/services/basket/basket.service';
import { displayErrorMessage, displaySuccessMessage } from 'ish-core/store/core/messages';
import { getProductEntities, loadProduct } from 'ish-core/store/shopping/products';
import { mapErrorToAction, mapToPayload, mapToPayloadProperty } from 'ish-core/utils/operators';

import {
  addBasketItemAttributes,
  addBasketItemAttributesFail,
  addBasketItemAttributesSuccess,
  addItemsToBasket,
  addItemsToBasketFail,
  addItemsToBasketFromCamCard,
  addItemsToBasketFromCamCardFail,
  addItemsToBasketSuccess,
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
  deleteBasketItem,
  deleteBasketItemAttributes,
  deleteBasketItemAttributesFail,
  deleteBasketItemAttributesSuccess,
  deleteBasketItemFail,
  deleteBasketItemSuccess,
  deleteBucket,
  deleteBucketFail,
  loadBasket,
  loadBasketAddresses,
  loadBasketSuccess,
  loadBuckets,
  loadBucketsFail,
  loadBucketsSuccess,
  updateBasketAddress,
  updateBasketItemAttributes,
  updateBasketItemAttributesFail,
  updateBasketItemAttributesSuccess,
  updateBasketItems,
  updateBasketItemsFail,
  updateBasketItemsSuccess,
  updateBucket,
  updateBucketFail,
  updateBucketSuccess,
  updateBucketsQueue,
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
          reduce(
            (acc, [val, entities]) => {
              // const element = acc.find(x => x.sku === val.sku);
              // if (element) {
              //   element.quantity += val.quantity;
              // } else {
              const { addressId, basketExtension, ...restValues } = val;
              acc.items.push({
                ...restValues,
                unit: entities[val.sku] && entities[val.sku].packingUnit,
                addressId,
              });
              if (basketExtension) {
                acc.extentions.push({ addressId, basketExtension });
              }
              // }
              return acc;
            },
            {
              items: [],
              extentions: [],
            }
          ),
          map(infoToAdd => {
            const extentions = infoToAdd.extentions.filter(
              ({ addressId }, i, arr) => arr.findIndex(el => el.addressId === addressId) === i
            );
            return { ...infoToAdd, extentions };
          }),
          map(({ items, extentions }) =>
            Object.values(extentions).length
              ? updateBucketsQueue({ items, extentions })
              : addItemsToBasketFromCamCard({ items })
          )
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
          addressId: payload.addressId,
          lineItemAttributes: payload.lineItemAttributes,
        }),
      ])
    )
  );

  addProductToBucket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addProductToBucket),
      mapToPayload(),
      mergeMap(payload => {
        if (!payload.basketId) {
          return this.basketService.createBasket().pipe(
            mergeMap(basket => [
              loadBasketSuccess({ basket }),
              addProductToBucketWithBasketId({
                address: payload.address,
                shippingMethod: STANDARD_SHIPPING_METHOD,
                sku: payload.sku,
                quantity: payload.quantity,
                basketId: basket.id,
                basketExtension: payload.basketExtension,
                lineItemAttributes: payload.lineItemAttributes,
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
            basketExtension: payload.basketExtension,
            lineItemAttributes: payload.lineItemAttributes,
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
                    basketExtension: payload.basketExtension,
                    addressId: address.id,
                    lineItemAttributes: payload.lineItemAttributes,
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

  updateBucket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateBucket),
      mapToPayload(),
      mergeMap(({ basketId, addressId, basketExtension, address }) =>
        this.basketService.updateBucket(basketId, addressId, basketExtension).pipe(
          mergeMap(() =>
            address
              ? [updateBasketAddress({ address, isBasket: true }), loadBasket()]
              : [updateBucketSuccess(), loadBasket()]
          ),
          mapErrorToAction(updateBucketFail)
        )
      )
    )
  );

  addItemsToBasket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addItemsToBasket),
      mapToPayload(),
      mergeMap(payload =>
        this.basketService.addItemsToBasket(payload.items).pipe(
          mergeMap(info => [
            addItemsToBasketSuccess({ info }),
            displaySuccessMessage({
              message: 'camfil.add_items_to_basket.camfil.message.success',
            }),
          ]),
          mapErrorToAction(addItemsToBasketFail)
        )
      )
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
   * Validates the basket after an update item error occurred
   */
  addItemsToBasketFail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addItemsToBasketFail),
      mapToPayload(),
      mergeMap(({ error }) => [
        displayErrorMessage({
          message: error.message,
        }),
      ])
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

  deleteBasketItemSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteBasketItemSuccess),
      map(() =>
        displaySuccessMessage({
          message: 'camfil.product_delete.confirmation',
        })
      )
    )
  );

  deleteBucket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteBucket),
      mapToPayload(),
      concatMap(payload =>
        this.basketService
          .deleteBucket(payload.basketId, payload.bucketId)
          .pipe(map(loadBuckets), mapErrorToAction(deleteBucketFail))
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
      tap(info => (info && info.length && info[0].message ? this.router.navigate(['/checkout']) : undefined)),
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

  addLineItemAttribute$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addBasketItemAttributes),
      mapToPayload(),
      mergeMap(payload =>
        this.basketService
          .addLineItemAttribute(payload.basketId, payload.lineItemId, payload.bucketId, payload.lineItemAttribute)
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
          .updateLineItemAttributes(payload.basketId, payload.lineItemId, payload.bucketId, payload.lineItemAttribute)
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

  addProductsFromCamCard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addProductsFromCamCard),
      mapToPayload(),
      mergeMap(payload =>
        this.basketService.createBasketAddress(payload.itemsInfo.address).pipe(
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
                  }),
                ]
              : [addProductToBucketAddressFromCamCardFail()];
          }),
          mapErrorToAction(addProductsFromCamCardFail)
        )
      )
    )
  );

  addProductsToBasketFromCamCard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addProductsToBasketFromCamCard),
      mapToPayload(),
      // accumulate all actions
      window(this.actions$.pipe(ofType(addProductsToBasketFromCamCard), debounceTime(1000))),
      mergeMap(window$ =>
        window$.pipe(
          withLatestFrom(this.store.pipe(select(getProductEntities))),
          // accumulate changes
          reduce(
            (acc, [val, entities]) => {
              const { addressId, basketExtension, shippingMethod, shipToAddress, products } = val;
              products.forEach(p => {
                const lineItemAttributes: Attribute = p.boxLabel && {
                  name: 'boxLabel',
                  type: 'String',
                  value: p.boxLabel,
                };
                const data = {
                  sku: p.sku,
                  quantity: p.quantity,
                  unit: entities[p.sku] && entities[p.sku].packingUnit,
                  shippingMethod,
                  shipToAddress,
                  addressId,
                  lineItemAttributes,
                };

                acc.items.push(data);
              });
              acc.extentions.push({ addressId, basketExtension });
              return acc;
            },
            {
              items: [],
              extentions: [],
            }
          ),
          map(({ items, extentions }) => updateBucketsQueue({ items, extentions }))
        )
      )
    )
  );

  updateBucketsQueue$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateBucketsQueue),
      mapToPayload(),
      withLatestFrom(this.store.pipe(select(getCurrentBasketId))),
      concatMap(([{ items, extentions }, basketId]) =>
        concat(
          ...Object.values(extentions).map(({ addressId, basketExtension }) =>
            this.basketService.updateBucket(basketId, addressId, basketExtension)
          )
        ).pipe(
          last(),
          mergeMap(() => [updateBucketSuccess(), addItemsToBasketFromCamCard({ items })]),
          mapErrorToAction(updateBucketFail)
        )
      )
    )
  );

  addItemsToBasketFromCamCard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addItemsToBasketFromCamCard),
      mapToPayload(),
      mergeMap(payload =>
        this.basketService.addItemsToBasket(payload.items).pipe(
          mergeMap(info => [
            loadBasket(),
            loadBasketAddresses(),
            addItemsToBasketSuccess({ info }),
            displaySuccessMessage({
              message: 'camfil.add_items_to_basket.camfil.message.success',
            }),
          ]),
          mapErrorToAction(addItemsToBasketFromCamCardFail)
        )
      )
    )
  );
}
