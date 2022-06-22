import { Injectable } from '@angular/core';
import { createEffect, ofType } from '@ngrx/effects';
import { select } from '@ngrx/store';
import { concat } from 'rxjs';
import { concatMap, defaultIfEmpty, filter, last, map, tap, withLatestFrom } from 'rxjs/operators';

import {
  LineItemUpdateHelper,
  LineItemUpdateHelperItem,
} from 'ish-core/models/line-item-update/line-item-update.helper';
import { BasketItemsEffects } from 'ish-core/store/customer/basket/basket-items.effects';
import {
  updateBasketItems,
  updateBasketItemsFail,
  updateBasketItemsSuccess,
} from 'ish-core/store/customer/basket/basket.actions';
import { getCurrentBasket } from 'ish-core/store/customer/basket/basket.selectors';
import { mapErrorToAction, mapToPayload } from 'ish-core/utils/operators';

import { camfilUpdateBasketItemsSuccess } from './ish-basket.actions';

@Injectable()
export class IshBasketItemsEffects extends BasketItemsEffects {
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
          tap(info => camfilUpdateBasketItemsSuccess({ lineItemUpdates: updates, info })),
          map(info => updateBasketItemsSuccess({ info })),
          mapErrorToAction(updateBasketItemsFail)
        )
      )
    )
  );
}
