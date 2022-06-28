import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { routerNavigatedAction } from '@ngrx/router-store';
import { Store, select } from '@ngrx/store';
import { camfilUpdateBasketItemsSuccess } from 'camfil-pwa/store/customer/ish-basket/ish-basket.actions';
import { debounceTime, filter, map, mergeMap, skipWhile, switchMapTo, take, tap, withLatestFrom } from 'rxjs/operators';

import { BasketView } from 'ish-core/models/basket/basket.model';
import { selectRouteParam } from 'ish-core/store/core/router';
import {
  addItemsToBasketFromCamCardSuccess,
  deleteBasketItemSuccess,
  getCurrentBasket,
  getSubmittedBasket,
} from 'ish-core/store/customer/basket';
import { createOrderSuccess } from 'ish-core/store/customer/orders';
import { mapToPayloadProperty, whenTruthy } from 'ish-core/utils/operators';

import {
  addProductToCamCardSuccess,
  createCamCardSuccess,
  deleteCamCardSuccess,
  getSelectedCamCardDetails,
  removeItemFromCamCardSuccess,
  updateCamCardProductSuccess,
  updateCamCardSuccess,
} from '../../../cam-cards/store/cam-card';
import { TrackingService } from '../../services/tracking.service';

@Injectable()
export class TrackingEventsEffects {
  constructor(private actions$: Actions, private store: Store, private trackingService: TrackingService) { }

  trackAddItemsToBasket$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(addItemsToBasketFromCamCardSuccess),
        withLatestFrom(this.store.select(getCurrentBasket)),
        map(([, oldBasket]) => oldBasket),
        mergeMap(oldBasket => this.store.select(getCurrentBasket).pipe(
          whenTruthy(),
          filter(currentBasket => !oldBasket || oldBasket.lineItems.length < currentBasket.lineItems.length),
          take(1),
          tap(currentBasket => this.trackingService.trackCartAddItem({
            ...currentBasket,
            lineItems: currentBasket.lineItems.filter(newItem => !oldBasket.lineItems.find(oldItem => oldItem.productSKU === newItem.productSKU))
          }))
        ))
      ),
    { dispatch: false }
  );

  trackChangeItemInBasket$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(camfilUpdateBasketItemsSuccess),
        withLatestFrom(this.store.select(getCurrentBasket)),
        map(([result, currentBasket]) => ({ updatedItems: result.payload.lineItemUpdates, currentBasket })),
        tap(updatedBasket =>
          updatedBasket.updatedItems.map(updatedItem => {
            const basketItem = updatedBasket.currentBasket.lineItems.find(item => item.id === updatedItem.itemId);

            if (basketItem) {
              const diff = basketItem.quantity.value - updatedItem.quantity;
              const lineItems = [
                {
                  ...basketItem,
                  quantity: { value: Math.abs(diff) },
                },
              ];
              const basket: BasketView = {
                ...updatedBasket.currentBasket,
                lineItems,
              };
              if (diff > 0) {
                return this.trackingService.trackCartRemoveItem(basket);
              }

              this.trackingService.trackCartAddItem(basket);
            }
          })
        )
      ),
    { dispatch: false }
  );

  trackDeleteItemsFromBasket$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(deleteBasketItemSuccess),
        withLatestFrom(this.store.select(getCurrentBasket)),
        tap(value => console.log('delete basket item', value)),
        map(([deleteItemPayload, currentBasket]) => ({
          ...currentBasket,
          lineItems: currentBasket.lineItems.filter(i => i.id === deleteItemPayload.payload.itemId)
        })),
        tap(currentBasket => this.trackingService.trackCartRemoveItem(currentBasket))
      ),
    { dispatch: false }
  );

  trackBeginCheckout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(routerNavigatedAction),
        tap(value => console.log('route action', value)),
        mapToPayloadProperty('routerState'),
        filter(routerState => routerState.url === '/checkout/onestep'),
        switchMapTo(this.store.select(getCurrentBasket)),
        whenTruthy(),
        take(1),
        map(currentBasket => this.trackingService.trackBeginCheckout(currentBasket))
      ),
    { dispatch: false }
  );

  trackViewItem$ = createEffect(
    () =>
      this.store.pipe(
        select(selectRouteParam('sku')),
        whenTruthy(),
        map(([sku, products]) => this.trackingService.trackViewItem(products[sku]))
      ),
    { dispatch: false }
  );

  trackOrder$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(createOrderSuccess),
        tap(data => console.log('order created', data)),
        withLatestFrom(this.store.select(getSubmittedBasket)),
        map(([, submittedBasket]) => submittedBasket),
        whenTruthy(),
        tap(data => console.log('basket from order created', data)),
        tap(submittedBasket => this.trackingService.trackOrder(submittedBasket))
      ),
    { dispatch: false }
  );

  trackCamCardCreate$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(createCamCardSuccess),
        mapToPayloadProperty('camCard'),
        tap(camCard => this.trackingService.trackCamCardCreate(camCard))
      ),
    { dispatch: false }
  );

  trackCamCardEdit$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(updateCamCardSuccess),
        withLatestFrom(this.store.pipe(select(getSelectedCamCardDetails))),
        map(([, camCardDetails]) => camCardDetails),
        tap(camCard => this.trackingService.trackCamCardEdit(camCard))
      ),
    { dispatch: false }
  );

  trackCamCardAddItem$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(addProductToCamCardSuccess),
        withLatestFrom(this.store.pipe(select(getSelectedCamCardDetails))),
        map(([, camCardDetails]) => camCardDetails),
        tap(camCard => this.trackingService.trackCamCardAddItem(camCard))
      ),
    { dispatch: false }
  );

  trackCamCardEditItem$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(updateCamCardProductSuccess),
        withLatestFrom(this.store.pipe(select(getSelectedCamCardDetails))),
        map(([, camCardDetails]) => camCardDetails),
        tap(camCard => this.trackingService.trackCamCardEdit(camCard))
      ),
    { dispatch: false }
  );

  trackCamCardRemoveItem$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(removeItemFromCamCardSuccess),
        withLatestFrom(this.store.pipe(select(getSelectedCamCardDetails))),
        map(([, camCardDetails]) => camCardDetails),
        tap(camCard => this.trackingService.trackCamCardEdit(camCard))
      ),
    { dispatch: false }
  );

  trackCamCardDelete$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(deleteCamCardSuccess),
        mapToPayloadProperty('camCardId'),
        tap(camCardId => this.trackingService.trackCamCardDelete(camCardId))
      ),
    { dispatch: false }
  );
}
