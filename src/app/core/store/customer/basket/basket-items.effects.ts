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
import { AttributeHelper } from 'ish-core/models/attribute/attribute.helper';
import { Bucket } from 'ish-core/models/bucket/bucket.model';
import {
  LineItemUpdateHelper,
  LineItemUpdateHelperItem,
} from 'ish-core/models/line-item-update/line-item-update.helper';
import { BasketService } from 'ish-core/services/basket/basket.service';
import { setCurrentLocale } from 'ish-core/store/core/configuration';
import { displayErrorMessage, displaySuccessMessage } from 'ish-core/store/core/messages';
import { selectUrl } from 'ish-core/store/core/router';
import { getUserAuthorized } from 'ish-core/store/customer/user';
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
  deleteBucketSuccess,
  deleteEmptyBucket,
  doubleBucketItemsQuantity,
  doubleBucketItemsQuantityFail,
  doubleBucketItemsQuantitySuccess,
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
              const { addressId, basketExtension, bucketId, ...restValues } = val;
              acc.items.push({
                ...restValues,
                unit: entities[val.sku] && entities[val.sku].packingUnit,
                addressId,
              });
              if (basketExtension) {
                acc.extensions.push({ addressId, basketExtension });
              }
              if (bucketId) {
                acc.bucketIds.push(bucketId);
              }
              return acc;
            },
            {
              items: [],
              extensions: [],
              bucketIds: [],
            }
          ),
          map(infoToAdd => {
            const extensions = infoToAdd.extensions.filter(
              ({ addressId }, i, arr) => arr.findIndex(el => el.addressId === addressId) === i
            );
            return { ...infoToAdd, extensions };
          }),
          withLatestFrom(this.store.pipe(select(getUserAuthorized))),
          mergeMap(([info, authorized]) => {
            const { items } = info;
            const hasExtensions = Object.values(info?.extensions)?.length;

            if (authorized) {
              return [hasExtensions ? updateBucketsQueue(info) : addItemsToBasketFromCamCard({ items: info.items })];
            } else {
              return [addItemsToBasket({ items })];
            }
          })
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
          : this.basketService
              .createBasket()
              .pipe(mergeMap(basket => [loadBasketSuccess({ basket }), addProduct(basket.id)]));
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

  addItemsToBasketSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addItemsToBasketSuccess),
      map(() =>
        displaySuccessMessage({
          message: 'camfil.add_items_to_basket.camfil.message.success',
        })
      )
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
          map(info => deleteBasketItemSuccess({ itemId, info })),
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
          .pipe(map(deleteBucketSuccess), mapErrorToAction(deleteBucketFail))
      )
    )
  );
  deleteBucketSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteBucketSuccess),
      map(() =>
        displaySuccessMessage({
          message: 'camfil.order_delete.confirmation',
        })
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
  loadBasketAfterBucketChangeSuccess$ = createEffect(() =>
    this.actions$.pipe(ofType(deleteBucketSuccess), mapTo(loadBasket()))
  );
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

  // CAMFIL
  updateLineItemAttributtes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateBasketItemAttributes),
      mapToPayload(),
      mergeMap(({ basketId, lineItemId, bucketId, lineItemAttribute }) =>
        this.basketService
          .updateLineItemAttributes(basketId, lineItemId, bucketId, lineItemAttribute)
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
              const { addressId, basketExtension, shippingMethod, shipToAddress, products, camCardName } = val;
              products.forEach(p => {
                const lineItemAttributes = AttributeHelper.calculateAttrsToAddFromCC(p);
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
              acc.extensions.push({ addressId, basketExtension });
              acc.camCardName = camCardName;
              return acc;
            },
            {
              items: [],
              extensions: [],
              camCardName: '',
            }
          ),
          map(({ items, extensions, camCardName }) => updateBucketsQueue({ items, extensions, camCardName }))
        )
      )
    )
  );
  updateBucketsQueue$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateBucketsQueue),
      mapToPayload(),
      withLatestFrom(this.store.pipe(select(getCurrentBasketId))),
      concatMap(([{ items, extensions, bucketIds, camCardName }, basketId]) =>
        concat(
          ...Object.values(extensions).map(({ addressId, basketExtension }) =>
            this.basketService.updateBucket(basketId, addressId, basketExtension)
          )
        ).pipe(
          last(),
          mergeMap(() => [updateBucketSuccess(), addItemsToBasketFromCamCard({ items, bucketIds, camCardName })]),
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
          mergeMap(() => {
            const emptyBuckets =
              payload.bucketIds
                ?.filter(id => id.split('_')[0] === 'emptyBucket')
                ?.map(id => deleteEmptyBucket({ id })) || [];
            const validBasket = emptyBuckets.length ? [validateBasket({ scopes: ['Products'] })] : [];

            return [
              loadBasket(),
              loadBasketAddresses(),
              addItemsToBasketFromCamCardSuccess(),
              ...emptyBuckets,
              ...validBasket,
              displaySuccessMessage({
                message: 'camfil.add_items_to_basket.camfil.message.success',
              }),
            ];
          }),
          mapErrorToAction(value =>
            addItemsToBasketFromCamCardFail({
              error: value.error,
              failedCamCardName: payload.camCardName,
            })
          )
        )
      )
    )
  );
  doubleBucketItemsQuantityItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(doubleBucketItemsQuantity),
      mapToPayload(),
      mergeMap(({ basketId, bucketId }) =>
        this.basketService.doubleBucketItemsQuantity(basketId, bucketId).pipe(
          mergeMap(() => [doubleBucketItemsQuantitySuccess(), loadBasket()]),
          mapErrorToAction(doubleBucketItemsQuantityFail)
        )
      )
    )
  );
  /**
   * Triggers a LoadBasket action after successful attribute change for Item
   */
  loadBasketAfterLineItemAttributeChangeSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addBasketItemAttributesSuccess, updateBasketItemAttributesSuccess, deleteBasketItemAttributesSuccess),
      mapTo(loadBasket())
    )
  );

  reloadBasketAfterLocaleChange = createEffect(() =>
    this.actions$.pipe(
      ofType(setCurrentLocale),
      withLatestFrom(this.store.pipe(select(selectUrl))),
      filter(([, url]) => url.startsWith('/checkout')),
      mergeMap(() => [validateBasket({ scopes: ['All'] }), loadBasket()])
    )
  );

  constructor(
    private actions$: Actions,
    private router: Router,
    private store: Store,
    private basketService: BasketService
  ) {}
}
