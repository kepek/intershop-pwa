import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { routerNavigatedAction } from '@ngrx/router-store';
import { Store, select } from '@ngrx/store';
import { map, switchMapTo, take, tap, withLatestFrom } from 'rxjs/operators';

import { ofUrl } from 'ish-core/store/core/router';
import {
  addItemsToBasketFromCamCardSuccess,
  deleteBasketItemSuccess,
  getCurrentBasket,
  getSubmittedBasket,
  updateBasketItemsSuccess,
} from 'ish-core/store/customer/basket';
import { createOrderSuccess } from 'ish-core/store/customer/orders';
import { getProductEntities } from 'ish-core/store/shopping/products';
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
  constructor(private actions$: Actions, private store: Store, private trackingService: TrackingService) {}

  // trackBeginCheckout$ = createEffect(
  //   () =>
  //     this.actions$.pipe(
  //       ofType(continueCheckout),
  //       filter(({ payload }) => payload.targetStep === 5),
  //       withLatestFrom(this.store.select(getCurrentBasket)),
  //       tap(([, currentBasket]) => this.trackingService.trackBeginCheckout(currentBasket))
  //     ),
  //   { dispatch: false }
  // );

  trackAddItemsToBasket$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(addItemsToBasketFromCamCardSuccess),
        withLatestFrom(this.store.select(getCurrentBasket)),
        map(([, currentBasket]) => currentBasket),
        withLatestFrom(this.store.pipe(select(getProductEntities))),
        tap(([currentBasket, products]) =>
          this.trackingService.trackCartAddItem(
            currentBasket,
            currentBasket.lineItems.map(item => products[item.productSKU])
          )
        )
      ),
    { dispatch: false }
  );

  trackChangeItemInBasket$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(updateBasketItemsSuccess),
        withLatestFrom(this.store.select(getCurrentBasket)),
        map(([result, currentBasket]) => ({ updatedItems: result.payload.lineItemUpdates, currentBasket })),
        withLatestFrom(this.store.pipe(select(getProductEntities))),
        tap(([updatedBasket, products]) =>
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
              const productsArray = [basketItem].map(b => products[b.productSKU]);

              if (diff > 0) {
                return this.trackingService.trackCartRemoveItem(
                  {
                    ...updatedBasket.currentBasket,
                    lineItems,
                  },
                  productsArray
                );
              }

              this.trackingService.trackCartAddItem(
                {
                  ...updatedBasket.currentBasket,
                  lineItems,
                },
                productsArray
              );
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
        map(([deleteItemPayload, currentBasket]) => ({
          ...currentBasket,
          lineItems: currentBasket.lineItems
            .filter(i => i.id === deleteItemPayload.payload.itemId)
            .map(item => ({ ...item, quantity: { value: 0 } })),
        })),
        withLatestFrom(this.store.pipe(select(getProductEntities))),
        tap(([currentBasket, products]) =>
          this.trackingService.trackCartRemoveItem(
            currentBasket,
            currentBasket.lineItems.map(item => products[item.productSKU])
          )
        )
      ),
    { dispatch: false }
  );

  trackBeginCheckout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(routerNavigatedAction),
        switchMapTo(
          this.store.pipe(
            ofUrl(/^\/checkout\/onestep/),
            take(1),
            select(getCurrentBasket),
            whenTruthy(),
            withLatestFrom(this.store.pipe(select(getProductEntities))),
            map(([basketView, products]) =>
              this.trackingService.trackBeginCheckout(
                basketView,
                basketView.lineItems.map(item => products[item.productSKU])
              )
            )
          )
        )
      ),
    { dispatch: false }
  );

  // trackViewItem$ = createEffect(
  //   () =>
  //     this.store.pipe(
  //       select(selectRouteParam('sku')),
  //       whenTruthy(),
  //       withLatestFrom(this.store.pipe(select(getProductEntities))),
  //       map(([sku, products]) => this.trackingService.trackViewItem(products[sku]))
  //     ),
  //   { dispatch: false }
  // );

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

  trackCamCardCreate$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(createCamCardSuccess),
        mapToPayloadProperty('camCard'),
        withLatestFrom(this.store.pipe(select(getProductEntities))),
        tap(([camCard, products]) =>
          this.trackingService.trackCamCardCreate(
            camCard,
            camCard.camCardItems.map(item => products[item.product.sku])
          )
        )
      ),
    { dispatch: false }
  );

  trackCamCardEdit$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(updateCamCardSuccess),
        withLatestFrom(this.store.pipe(select(getSelectedCamCardDetails))),
        map(([, camCardDetails]) => camCardDetails),
        withLatestFrom(this.store.pipe(select(getProductEntities))),
        tap(([camCard, products]) =>
          this.trackingService.trackCamCardEdit(
            camCard,
            camCard.camCardItems.map(item => products[item.product.sku])
          )
        )
      ),
    { dispatch: false }
  );

  trackCamCardAddItem$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(addProductToCamCardSuccess),
        withLatestFrom(this.store.pipe(select(getSelectedCamCardDetails))),
        map(([, camCardDetails]) => camCardDetails),
        withLatestFrom(this.store.pipe(select(getProductEntities))),
        tap(([camCard, products]) =>
          this.trackingService.trackCamCardAddItem(
            camCard,
            camCard.camCardItems.map(item => products[item.product?.sku])
          )
        )
      ),
    { dispatch: false }
  );

  trackCamCardEditItem$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(updateCamCardProductSuccess),
        withLatestFrom(this.store.pipe(select(getSelectedCamCardDetails))),
        map(([, camCardDetails]) => camCardDetails),
        withLatestFrom(this.store.pipe(select(getProductEntities))),
        tap(([camCard, products]) =>
          this.trackingService.trackCamCardEdit(
            camCard,
            camCard.camCardItems.map(item => products[item.product?.sku])
          )
        )
      ),
    { dispatch: false }
  );

  trackCamCardRemoveItem$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(removeItemFromCamCardSuccess),
        withLatestFrom(this.store.pipe(select(getSelectedCamCardDetails))),
        map(([, camCardDetails]) => camCardDetails),
        withLatestFrom(this.store.pipe(select(getProductEntities))),
        tap(([camCard, products]) =>
          this.trackingService.trackCamCardEdit(
            camCard,
            camCard.camCardItems.map(item => products[item.product?.sku])
          )
        )
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
