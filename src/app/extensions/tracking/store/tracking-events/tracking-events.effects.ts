import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { filter, map, tap, withLatestFrom } from 'rxjs/operators';

import {
  addItemsToBasketFromCamCardSuccess,
  continueCheckout,
  deleteBasketItemSuccess,
  getCurrentBasket,
  getSubmittedBasket,
} from 'ish-core/store/customer/basket';
import { createOrderSuccess } from 'ish-core/store/customer/orders';
import { mapToPayloadProperty, whenTruthy } from 'ish-core/utils/operators';

import { createCamCardSuccess, deleteCamCardSuccess, updateCamCardSuccess } from '../../../cam-cards/store/cam-card';
import { TrackingService } from '../../services/tracking.service';

import { trackViewCart, trackViewItem } from './tracking-events.actions';

@Injectable()
export class TrackingEventsEffects {
  constructor(private actions$: Actions, private store: Store, private trackingService: TrackingService) {}

  trackBeginCheckout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(continueCheckout),
        filter(({ payload }) => payload.targetStep === 5),
        withLatestFrom(this.store.select(getCurrentBasket)),
        tap(([, currentBasket]) => this.trackingService.trackBeginCheckout(currentBasket))
      ),
    { dispatch: false }
  );

  trackAddItemsToBasket$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(addItemsToBasketFromCamCardSuccess),
        withLatestFrom(this.store.select(getCurrentBasket)),
        tap(([, currentBasket]) => this.trackingService.trackCartAddItem(currentBasket))
      ),
    { dispatch: false }
  );

  trackDeleteItemsFromBasket$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(deleteBasketItemSuccess),
        withLatestFrom(this.store.select(getCurrentBasket)),
        tap(([deleteItemPayload, currentBasket]) =>
          this.trackingService.trackCartRemoveItem(deleteItemPayload.payload.itemId, currentBasket)
        )
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
        mapToPayloadProperty('camCard'),
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

  trackViewCart$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(trackViewCart),
        withLatestFrom(this.store.select(getCurrentBasket)),
        tap(([, currentBasket]) => this.trackingService.trackViewCart(currentBasket))
      ),
    { dispatch: false }
  );

  trackViewItem$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(trackViewItem),
        tap(({ payload }) => this.trackingService.trackViewItem(payload.product))
      ),
    { dispatch: false }
  );

  trackOrder$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(createOrderSuccess),
        withLatestFrom(this.store.select(getSubmittedBasket)),
        map(([, submittedBasket]) => submittedBasket),
        whenTruthy(),
        tap(submittedBasket => this.trackingService.trackOrder(submittedBasket))
      ),
    { dispatch: false }
  );
}
