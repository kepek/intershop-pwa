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
  addItemsToBasketFromCamCardSuccess,
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
            // const element = acc.find(x => x.sku === val.sku);
            // if (element) {
            //   element.quantity += val.quantity;
            // } else {
            acc.push({
              ...val,
              unit: entities[val.sku] && entities[val.sku].packingUnit,
              shippingMethod: val.shippingMethod,
              shipToAddress: val.shipToAddress,
              basketExtension: val.basketExtension,
              addressId: val.addressId,
              lineItemAttributes: val.lineItemAttributes,
            });
            // }
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
          basketExtension: payload.basketExtension,
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
      mergeMap(payload =>
        this.basketService.updateBucket(payload.basketId, payload.addressId, payload.basketExtension).pipe(
          mergeMap(() => {
            const { address } = payload;
            if (address) {
              return [updateBasketAddress({ address, isBasket: true }), loadBasket()];
            } else {
              return [updateBucketSuccess(), loadBasket()];
            }
          }),
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
        const item = payload.items?.[0];
        const { basketExtension, addressId } = item;
        // TODO Changes required because BE side attribue OOTB are not working when adding product to cart
        const getActions = (info, bktId) => {
          const send = [
            addItemsToBasketSuccess({ info }),
            updateBucket({
              basketId: bktId,
              addressId,
              basketExtension,
            }),
            displaySuccessMessage({
              message: 'camfil.add_items_to_basket.camfil.message.success',
            }),
          ];

          if (!basketExtension) {
            send.splice(1, 1);
          }

          return send;
        };

        if (basketId) {
          return this.basketService.addItemsToBasket(payload.items).pipe(
            concatMap(info => getActions(info, basketId)),
            mapErrorToAction(addItemsToBasketFail)
          );
        } else {
          return this.basketService.createBasket().pipe(
            switchMap(basket =>
              this.basketService.addItemsToBasket(payload.items).pipe(
                concatMap(info => getActions(info, basket.id)),
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
      ofType(
        addItemsToBasketSuccess,
        addItemsToBasketFromCamCardSuccess,
        updateBasketItemsSuccess,
        deleteBasketItemSuccess
      ),
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
          .addLineItemAttribute(payload.basketId, payload.lineItemId, payload.lineItemAttribute)
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
          .updateLineItemAttributes(payload.basketId, payload.lineItemId, payload.lineItemAttribute)
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
              acc.basketExtensions.push({ addressId, extension: basketExtension });
              return acc;
            },
            {
              items: [],
              basketExtensions: [],
            }
          ),
          map(({ items, basketExtensions }) => addItemsToBasketFromCamCard({ items, basketExtensions }))
        )
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

  addItemsToBasketFromCamCard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addItemsToBasketFromCamCard),
      mapToPayload(),
      withLatestFrom(this.store.pipe(select(getCurrentBasketId))),
      concatMap(([payload, basketId]) => {
        const getActions = (info, bktId) => {
          const updateBuckets = payload.basketExtensions.map(b =>
            updateBucket({
              basketId: bktId,
              addressId: b.addressId,
              basketExtension: b.extension,
            })
          );
          return [
            addItemsToBasketFromCamCardSuccess({ info }),
            ...updateBuckets,
            loadBasketAddresses(),
            displaySuccessMessage({
              message: 'camfil.add_items_to_basket.camfil.message.success',
            }),
          ];
        };

        if (basketId) {
          return this.basketService.addItemsToBasket(payload.items).pipe(
            concatMap(info => getActions(info, basketId)),
            mapErrorToAction(addItemsToBasketFromCamCardFail)
          );
        } else {
          return this.basketService.createBasket().pipe(
            switchMap(basket =>
              this.basketService.addItemsToBasket(payload.items).pipe(
                concatMap(info => getActions(info, basket.id)),
                mapErrorToAction(addItemsToBasketFromCamCardFail)
              )
            )
          );
        }
      })
    )
  );
}
