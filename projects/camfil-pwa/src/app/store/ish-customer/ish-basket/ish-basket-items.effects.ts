import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { IshBasketService } from 'camfil-pwa/services/ish-basket/ish-basket.service';
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

import { AttributeHelper } from 'ish-core/models/attribute/attribute.helper';
import {
  LineItemUpdateHelper,
  LineItemUpdateHelperItem,
} from 'ish-core/models/line-item-update/line-item-update.helper';
import { BasketService } from 'ish-core/services/basket/basket.service';
import { setCurrentLocale } from 'ish-core/store/core/configuration';
import { displaySuccessMessage } from 'ish-core/store/core/messages';
import { selectUrl } from 'ish-core/store/core/router';
import { BasketItemsEffects } from 'ish-core/store/customer/basket/basket-items.effects';
import {
  addBasketItemAttributes,
  addBasketItemAttributesFail,
  addBasketItemAttributesSuccess,
  addItemsToBasket,
  addItemsToBasketFromCamCard,
  addItemsToBasketFromCamCardFail,
  addItemsToBasketFromCamCardSuccess,
  addItemsToBasketSuccess,
  addProductToBasket,
  addProductsToBasketFromCamCard,
  deleteBasketItemAttributes,
  deleteBasketItemAttributesFail,
  deleteBasketItemAttributesSuccess,
  deleteBasketItemSuccess,
  deleteBucketSuccess,
  deleteEmptyBucket,
  doubleBucketItemsQuantity,
  doubleBucketItemsQuantityFail,
  doubleBucketItemsQuantitySuccess,
  loadBasketAddresses,
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
} from 'ish-core/store/customer/basket/basket.actions';
import { getCurrentBasket, getCurrentBasketId } from 'ish-core/store/customer/basket/basket.selectors';
import { getUserAuthorized } from 'ish-core/store/customer/user';
import { getProductEntities } from 'ish-core/store/shopping/products';
import { mapErrorToAction, mapToPayload, mapToPayloadProperty } from 'ish-core/utils/operators';

import { camfilUpdateBasketItemsSuccess, reloadBasket } from './ish-basket.actions';
import { EMPTY_BUCKET_PREFIX } from './ish-basket.effects';

@Injectable()
export class IshBasketItemsEffects extends BasketItemsEffects {
  constructor(
    actions$: Actions,
    router: Router,
    store: Store,
    basketService: BasketService,
    private ishActions$: Actions,
    private ishRouter: Router,
    private ishStore: Store,
    private ishBasketService: IshBasketService
  ) {
    super(actions$, router, store, basketService);
  }
  addProductToBasket$ = createEffect(() =>
    this.ishActions$.pipe(
      ofType(addProductToBasket),
      mapToPayload(),
      // accumulate all actions
      window(this.ishActions$.pipe(ofType(addProductToBasket), debounceTime(1000))),
      mergeMap(window$ =>
        window$.pipe(
          withLatestFrom(this.ishStore.pipe(select(getProductEntities))),
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
          withLatestFrom(this.ishStore.pipe(select(getUserAuthorized))),
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
  updateBasketItems$ = createEffect(() =>
    this.ishActions$.pipe(
      ofType(updateBasketItems),
      mapToPayload(),
      withLatestFrom(this.ishStore.pipe(select(getCurrentBasket))),
      filter(([payload, basket]) => !!basket.lineItems && !!payload.lineItemUpdates),
      map(([{ lineItemUpdates }, { lineItems }]) =>
        LineItemUpdateHelper.filterUpdatesByItems(lineItemUpdates, lineItems as LineItemUpdateHelperItem[])
      ),
      concatMap(updates =>
        concat(
          ...updates.map(update => {
            if (update.quantity === 0) {
              return this.ishBasketService.deleteBasketItem(update.itemId);
            } else {
              return this.ishBasketService.updateBasketItem(update.itemId, {
                quantity: update.quantity > 0 ? { value: update.quantity, unit: update.unit } : undefined,
                product: update.sku,
              });
            }
          })
        ).pipe(
          defaultIfEmpty(),
          last(),
          tap(info => this.ishStore.dispatch(camfilUpdateBasketItemsSuccess({ lineItemUpdates: updates, info }))),
          map(info => updateBasketItemsSuccess({ info })),
          mapErrorToAction(updateBasketItemsFail)
        )
      )
    )
  );
  addLineItemAttribute$ = createEffect(() =>
    this.ishActions$.pipe(
      ofType(addBasketItemAttributes),
      mapToPayload(),
      mergeMap(payload =>
        this.ishBasketService
          .addLineItemAttribute(payload.basketId, payload.lineItemId, payload.bucketId, payload.lineItemAttribute)
          .pipe(map(addBasketItemAttributesSuccess), mapErrorToAction(addBasketItemAttributesFail))
      )
    )
  );
  updateLineItemAttributtes$ = createEffect(() =>
    this.ishActions$.pipe(
      ofType(updateBasketItemAttributes),
      mapToPayload(),
      mergeMap(({ basketId, lineItemId, bucketId, lineItemAttribute }) =>
        this.ishBasketService
          .updateLineItemAttributes(basketId, lineItemId, bucketId, lineItemAttribute)
          .pipe(map(updateBasketItemAttributesSuccess), mapErrorToAction(updateBasketItemAttributesFail))
      )
    )
  );
  deleteLineItemAttributte$ = createEffect(() =>
    this.ishActions$.pipe(
      ofType(deleteBasketItemAttributes),
      mapToPayload(),
      mergeMap(payload =>
        this.ishBasketService
          .deleteLineItemAttributes(payload.basketId, payload.lineItemId, payload.bucketId, payload.attributeName)
          .pipe(map(deleteBasketItemAttributesSuccess), mapErrorToAction(deleteBasketItemAttributesFail))
      )
    )
  );
  loadBasketAfterBasketItemsChangeSuccess$ = createEffect(() =>
    this.ishActions$.pipe(
      ofType(addItemsToBasketSuccess, updateBasketItemsSuccess, deleteBasketItemSuccess),
      mapToPayloadProperty('info'),
      tap(info => (info && info.length && info[0].message ? this.ishRouter.navigate(['/checkout']) : undefined)),
      mapTo(reloadBasket())
    )
  );
  updateBucket$ = createEffect(() =>
    this.ishActions$.pipe(
      ofType(updateBucket),
      mapToPayload(),
      mergeMap(({ basketId, addressId, basketExtension, address }) =>
        this.ishBasketService.updateBucket(basketId, addressId, basketExtension).pipe(
          mergeMap(() =>
            address
              ? [updateBasketAddress({ address, isBasket: true }), reloadBasket()]
              : [updateBucketSuccess(), reloadBasket()]
          ),
          mapErrorToAction(updateBucketFail)
        )
      )
    )
  );
  updateBucketsQueue$ = createEffect(() =>
    this.ishActions$.pipe(
      ofType(updateBucketsQueue),
      mapToPayload(),
      withLatestFrom(this.ishStore.pipe(select(getCurrentBasketId))),
      concatMap(([{ items, extensions, bucketIds, camCardName }, basketId]) =>
        concat(
          ...Object.values(extensions).map(({ addressId, basketExtension }) =>
            this.ishBasketService.updateBucket(basketId, addressId, basketExtension)
          )
        ).pipe(
          last(),
          mergeMap(() => [updateBucketSuccess(), addItemsToBasketFromCamCard({ items, bucketIds, camCardName })]),
          mapErrorToAction(updateBucketFail)
        )
      )
    )
  );
  addProductsToBasketFromCamCard$ = createEffect(() =>
    this.ishActions$.pipe(
      ofType(addProductsToBasketFromCamCard),
      mapToPayload(),
      // accumulate all actions
      window(this.ishActions$.pipe(ofType(addProductsToBasketFromCamCard), debounceTime(1000))),
      mergeMap(window$ =>
        window$.pipe(
          withLatestFrom(this.ishStore.pipe(select(getProductEntities))),
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
  doubleBucketItemsQuantityItems$ = createEffect(() =>
    this.ishActions$.pipe(
      ofType(doubleBucketItemsQuantity),
      mapToPayload(),
      mergeMap(({ basketId, bucketId }) =>
        this.ishBasketService.doubleBucketItemsQuantity(basketId, bucketId).pipe(
          mergeMap(() => [doubleBucketItemsQuantitySuccess(), reloadBasket()]),
          mapErrorToAction(doubleBucketItemsQuantityFail)
        )
      )
    )
  );
  addItemsToBasketFromCamCard$ = createEffect(() =>
    this.ishActions$.pipe(
      ofType(addItemsToBasketFromCamCard),
      mapToPayload(),
      withLatestFrom(this.ishStore.pipe(select(selectUrl))),
      mergeMap(([payload, url]) => {
        const isOnestepCheckout = url.startsWith('/checkout/onestep');
        const emptyBucketIds = payload.bucketIds?.filter(id => id.split('_')[0] === EMPTY_BUCKET_PREFIX);

        return this.ishBasketService.addItemsToBasket(payload.items, isOnestepCheckout).pipe(
          mergeMap(() => {
            const deleteEmptyBuckets = emptyBucketIds?.map(id => deleteEmptyBucket({ id })) || [];
            const validBasket = deleteEmptyBuckets.length ? [validateBasket({ scopes: ['Products'] })] : [];

            return [
              reloadBasket(),
              loadBasketAddresses(),
              addItemsToBasketFromCamCardSuccess(),
              ...deleteEmptyBuckets,
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
        );
      })
    )
  );
  reloadBasketAfterLocaleChange = createEffect(() =>
    this.ishActions$.pipe(
      ofType(setCurrentLocale),
      withLatestFrom(this.ishStore.pipe(select(selectUrl))),
      filter(([, url]) => url.startsWith('/checkout')),
      mergeMap(() => [validateBasket({ scopes: ['All'] }), reloadBasket()])
    )
  );
  loadBasketAfterBucketChangeSuccess$ = createEffect(() =>
    this.ishActions$.pipe(ofType(deleteBucketSuccess), mapTo(reloadBasket()))
  );
  loadBasketAfterLineItemAttributeChangeSuccess$ = createEffect(() =>
    this.ishActions$.pipe(
      ofType(addBasketItemAttributesSuccess, updateBasketItemAttributesSuccess, deleteBasketItemAttributesSuccess),
      mapTo(reloadBasket())
    )
  );
  deleteBasketItemSuccess$ = createEffect(() =>
    this.ishActions$.pipe(
      ofType(deleteBasketItemSuccess),
      map(() =>
        displaySuccessMessage({
          message: 'camfil.product_delete.confirmation',
        })
      )
    )
  );
}
