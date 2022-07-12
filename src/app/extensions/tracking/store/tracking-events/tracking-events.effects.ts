import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { routerNavigatedAction } from '@ngrx/router-store';
import { Store, select } from '@ngrx/store';
import { camfilUpdateBasketItemsSuccess } from 'camfil-pwa/store/customer/ish-basket/ish-basket.actions';
import { Observable } from 'rxjs';
import { filter, map, mergeMap, pairwise, skipWhile, switchMapTo, take, tap, withLatestFrom } from 'rxjs/operators';

import { BasketView } from 'ish-core/models/basket/basket.model';
import { selectRouteParam, selectRouter } from 'ish-core/store/core/router';
import {
  addItemsToBasketFromCamCardSuccess,
  deleteBasketItemSuccess,
  getCurrentBasket,
  getSubmittedBasket,
} from 'ish-core/store/customer/basket';
import { createOrderSuccess } from 'ish-core/store/customer/orders';
import { setProductListingPages } from 'ish-core/store/shopping/product-listing';
import { getSelectedProduct } from 'ish-core/store/shopping/products';
import { mapToPayloadProperty, whenTruthy } from 'ish-core/utils/operators';

import {
  addBasketToNewCamCardSuccess,
  addProductToCamCardSuccess,
  createCamCardSuccess,
  deleteCamCardSuccess,
  getCamCardDetails,
  getSelectedCamCardDetails,
  removeItemFromCamCardSuccess,
  updateCamCardProductSuccess,
  updateCamCardSuccess,
} from '../../../cam-cards/store/cam-card';
import { loadQuoteDetailsSuccess } from '../../../cam-quotes/store/cam-quotes.actions';
import { DataLayerOrderType, DataLayerPageType } from '../../models/data-layer-event.type';
import { TrackingService } from '../../services/tracking.service';

@Injectable()
export class TrackingEventsEffects {
  constructor(private actions$: Actions, private store: Store, private trackingService: TrackingService) {}

  trackAddItemsToBasket$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(addItemsToBasketFromCamCardSuccess),
        withLatestFrom(this.store.select(getCurrentBasket)),
        map(([, oldBasket]) => oldBasket),
        mergeMap(oldBasket =>
          this.store.select(getCurrentBasket).pipe(
            whenTruthy(),
            filter(currentBasket => !oldBasket || oldBasket.lineItems.length < currentBasket.lineItems.length),
            take(1)
          )
        ),
        mergeMap(currentBasket => this.getPageTypeFromRouter().pipe(map(pageType => ({ currentBasket, pageType })))),
        tap(({ currentBasket, pageType }) =>
          this.trackingService.trackCartAddItem(
            {
              ...currentBasket,
              lineItems: [currentBasket.lineItems[currentBasket.lineItems.length - 1]],
            },
            pageType
          )
        )
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
                return this.trackingService.trackCartRemoveItem(basket, DataLayerPageType.Checkout);
              }

              this.trackingService.trackCartAddItem(basket, DataLayerPageType.Checkout);
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
          lineItems: currentBasket.lineItems.filter(i => i.id === deleteItemPayload.payload.itemId),
        })),
        tap(currentBasket => this.trackingService.trackCartRemoveItem(currentBasket, DataLayerPageType.Checkout))
      ),
    { dispatch: false }
  );

  trackBeginCheckout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(routerNavigatedAction),
        mapToPayloadProperty('routerState'),
        filter(routerState => routerState.url === '/checkout/onestep'),
        switchMapTo(this.store.pipe(select(getCurrentBasket), whenTruthy(), take(1))),
        map(currentBasket => this.trackingService.trackBeginCheckout(currentBasket))
      ),
    { dispatch: false }
  );

  trackSelectItem$ = createEffect(
    () =>
      this.store.pipe(
        select(selectRouter),
        whenTruthy(),
        pairwise(),
        filter(
          ([prevRoute, currentRoute]) =>
            prevRoute &&
            prevRoute.state &&
            currentRoute &&
            currentRoute.state &&
            currentRoute.state.params &&
            currentRoute.state.params.sku
        ),
        mergeMap(([prevRoute]) =>
          this.store.pipe(
            select(getSelectedProduct),
            whenTruthy(),
            skipWhile(product => !product.salePrice || !product.defaultCategory || !product.defaultCategory()),
            take(1),
            map(product => ({
              product,
              pageType: this.getPageTypeFromPath(prevRoute.state.path, prevRoute.state.params),
            }))
          )
        ),
        tap(({ product, pageType }) => this.trackingService.trackSelectItem(product, pageType))
      ),
    { dispatch: false }
  );

  trackViewItem$ = createEffect(
    () =>
      this.store.pipe(
        select(selectRouteParam('sku')),
        whenTruthy(),
        switchMapTo(
          this.store.pipe(
            select(getSelectedProduct),
            whenTruthy(),
            skipWhile(product => !product.salePrice || !product.defaultCategory || !product.defaultCategory()),
            take(1)
          )
        ),
        map(product => this.trackingService.trackViewItem(product))
      ),
    { dispatch: false }
  );

  trackOrder$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(createOrderSuccess),
        mapToPayloadProperty('order'),
        mergeMap(order =>
          this.store.pipe(
            select(getSubmittedBasket),
            take(1),
            map(submittedBasket => ({ order, submittedBasket }))
          )
        ),
        tap(({ order, submittedBasket }) =>
          this.trackingService.trackOrder(
            submittedBasket,
            order.statusCode === 'RFQ' ? DataLayerOrderType.Quotation : DataLayerOrderType.Order
          )
        )
      ),
    { dispatch: false }
  );

  trackCamCardCreate$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(createCamCardSuccess),
        mapToPayloadProperty('camCard'),
        mergeMap(camCard => this.getPageTypeFromRouter().pipe(map(pageType => ({ camCard, pageType })))),
        tap(({ camCard, pageType }) => this.trackingService.trackCamCardCreate(camCard, pageType))
      ),
    { dispatch: false }
  );

  trackCamCardCreateFromBasket$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(addBasketToNewCamCardSuccess),
        mapToPayloadProperty('camCard'),
        tap(camCard => {
          this.trackingService.trackCamCardCreate(camCard, DataLayerPageType.Checkout);
          this.trackingService.trackCamCardAddItem(camCard, DataLayerPageType.Checkout);
        })
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
        mapToPayloadProperty('camCard'),
        mergeMap(camCard => this.store.pipe(select(getCamCardDetails, { id: camCard.id }), whenTruthy(), take(1))),
        mergeMap(camCard => this.getPageTypeFromRouter().pipe(map(pageType => ({ camCard, pageType })))),
        tap(({ camCard, pageType }) => this.trackingService.trackCamCardAddItem(camCard, pageType))
      ),
    { dispatch: false }
  );

  trackCamCardEditItem$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(updateCamCardProductSuccess),
        withLatestFrom(this.store.pipe(select(getSelectedCamCardDetails))),
        map(([, camCardDetails]) => camCardDetails),
        mergeMap(camCard => this.getPageTypeFromRouter().pipe(map(pageType => ({ camCard, pageType })))),
        tap(({ camCard, pageType }) => this.trackingService.trackCamCardEdit(camCard, pageType))
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
        mergeMap(camCardId => this.getPageTypeFromRouter().pipe(map(pageType => ({ camCardId, pageType })))),
        tap(({ camCardId, pageType }) => this.trackingService.trackCamCardDelete(camCardId, pageType))
      ),
    { dispatch: false }
  );

  // Items lists tracking
  trackViewItemList$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(setProductListingPages),
        whenTruthy(),
        map(action => action.payload),
        tap(productListingType => {
          const products = productListingType[
            Object.keys(productListingType).find(key => !isNaN(parseInt(key, 10)))
          ] as string[];
          if (!products || !products.length) {
            return;
          }

          if (productListingType.id.type === 'category') {
            this.trackingService.trackViewItemList(
              products,
              DataLayerPageType.ProductListing,
              productListingType.id.value
            );
          } else if (productListingType.id.type === 'search') {
            this.trackingService.trackViewItemList(products, DataLayerPageType.SearchResult);
          }
        })
      ),
    { dispatch: false }
  );

  trackViewItemListInQuoteDetails$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loadQuoteDetailsSuccess),
        mapToPayloadProperty('quoteDetails'),
        tap(quoteDetails => this.trackingService.trackViewItemListFromQuotation(quoteDetails))
      ),
    { dispatch: false }
  );

  trackViewItemListInCamcardDetails$ = createEffect(
    () =>
      this.store.pipe(
        select(selectRouter),
        whenTruthy(),
        skipWhile(router => !router.state),
        map(router => this.getPageTypeFromPath(router.state.path, router.state.params)),
        filter(pageType => pageType === DataLayerPageType.CamCardDetail),
        switchMapTo(
          this.store.pipe(
            select(getSelectedCamCardDetails),
            whenTruthy(),
            take(1),
            tap(camCard => this.trackingService.trackViewItemListFromCamCard(camCard))
          )
        )
      ),
    { dispatch: false }
  );

  getPageTypeFromRouter(): Observable<DataLayerPageType> {
    return this.store.select(selectRouter).pipe(
      whenTruthy(),
      skipWhile(router => !router.state || !router.state.path),
      map(router => this.getPageTypeFromPath(router.state.path, router.state.params)),
      take(1)
    );
  }

  getPageTypeFromPath(path: string, params: Params): DataLayerPageType {
    if (path === 'account/camcards') {
      return DataLayerPageType.CamCardListing;
    }

    if (path === 'account/camcards/create') {
      return DataLayerPageType.CamCardDetail;
    }

    if (path === 'account/camcards/:camCardName') {
      return DataLayerPageType.CamCardDetail;
    }

    if (path === 'account/quotes/:id') {
      return DataLayerPageType.QuoteDetail;
    }

    if (path === 'search/:searchTerm') {
      return DataLayerPageType.SearchResult;
    }

    if (`${path}`.includes('checkout')) {
      return DataLayerPageType.Checkout;
    }

    if (params && params.sku) {
      return DataLayerPageType.ProductDetail;
    }

    return DataLayerPageType.ProductListing;
  }
}
