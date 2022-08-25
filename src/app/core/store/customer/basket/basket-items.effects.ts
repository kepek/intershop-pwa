import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { concat } from 'rxjs';
import {
  concatMap,
  defaultIfEmpty,
  filter,
  last,
  map,
  mapTo,
  mergeMap,
  switchMap,
  withLatestFrom,
} from 'rxjs/operators';

import {
  LineItemUpdateHelper,
  LineItemUpdateHelperItem,
} from 'ish-core/models/line-item-update/line-item-update.helper';
import { BasketService } from 'ish-core/services/basket/basket.service';
import { displayErrorMessage, displaySuccessMessage } from 'ish-core/store/core/messages';
import { loadProduct } from 'ish-core/store/shopping/products';
import { mapErrorToAction, mapToPayload, mapToPayloadProperty } from 'ish-core/utils/operators';

import {
  addItemsToBasket,
  addItemsToBasketFail,
  addItemsToBasketSuccess,
  deleteBasketItem,
  deleteBasketItemFail,
  deleteBasketItemSuccess,
  updateBasketItems,
  updateBasketItemsFail,
  updateBasketItemsSuccess,
  validateBasket,
} from './basket.actions';
import { getCurrentBasket, getCurrentBasketId } from './basket.selectors';

@Injectable()
export class BasketItemsEffects {
  constructor(
    private actions$: Actions,
    // @ts-ignore // TODO (extMlk): remove @ts-ignore when in use
    private router: Router,
    private store: Store,
    private basketService: BasketService
  ) {}

  /**
   * Add a product to the current basket.
   * Triggers the internal AddItemsToBasket action that handles the actual adding of the product to the basket.
   */
  // tslint:disable-next-line:force-jsdoc-comments
  /*
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
              acc.push({ ...val, unit: entities[val.sku] && entities[val.sku].packingUnit });
            }
            return acc;
          }, []),
          map(items => addItemsToBasket({ items }))
        )
      )
    )
  );
  */
  /**
   * Add a product to the current basket.
   * Triggers the internal AddItemsToBasket action that handles the actual adding of the product to the basket.
   */
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
  /**
   * Triggers a LoadBasket action after successful interaction with the Basket API.
   */
  // tslint:disable-next-line:force-jsdoc-comments no-commented-out-code
  /*
  loadBasketAfterBasketItemsChangeSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addItemsToBasketSuccess, updateBasketItemsSuccess, deleteBasketItemSuccess),
      mapToPayloadProperty('info'),
      tap(info => (info && info.length && info[0].message ? this.router.navigate(['/checkout']) : undefined)),
      mapTo(loadBasket())
    )
  );
  */
}
