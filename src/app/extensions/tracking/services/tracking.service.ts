import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { FeatureToggleService } from 'ish-core/feature-toggle.module';
import { BasketView } from 'ish-core/models/basket/basket.model';
import { LineItemView } from 'ish-core/models/line-item/line-item.model';
import { Product } from 'ish-core/models/product/product.model';
import { getProduct } from 'ish-core/store/shopping/products';
import { CookiesService } from 'ish-core/utils/cookies/cookies.service';
import { whenTruthy } from 'ish-core/utils/operators';

import { CamCard } from '../../cam-cards/models/cam-card/cam-card.model';
import {
  DataLayerEvent,
  DataLayerEventType,
  DataLayerItem,
  DataLayerPageType,
  DataLayerProduct,
} from '../models/data-layer-event.type';

// tslint:disable-next-line: no-any
declare var dataLayer: any;

/**
 *  Add events to dataLayer for GTM
 */
@Injectable({ providedIn: 'root' })
export class TrackingService {
  constructor(
    private store: Store,
    private featureToggleService: FeatureToggleService,
    private cookiesService: CookiesService
  ) {}

  trackBeginCheckout(basket: BasketView, products: Product[]) {
    this.push(this.buildEventDataFromBasket(DataLayerEventType.BeginCheckout, basket, products));
  }

  trackCartAddItem(basket: BasketView, products: Product[]) {
    this.push(this.buildEventDataFromBasket(DataLayerEventType.CartAddItem, basket, products));
  }

  trackCartRemoveItem(basket: BasketView, products: Product[]) {
    this.push(this.buildEventDataFromBasket(DataLayerEventType.CartRemoveItem, basket, products));
  }

  trackViewCart(basket: BasketView) {
    this.push(this.buildEventDataFromBasket(DataLayerEventType.CartView, basket));
  }

  trackViewItem(product: Product) {
    const event: DataLayerEvent = {
      event: DataLayerEventType.ItemView,
      currency: product.salePrice.currency,
      value: product.salePrice.value,
      items: [
        {
          item_id: product.sku,
          currency: product.salePrice.currency,
          discount: 0,
          index: 0,
          price: product.salePrice.value,
          quantity: 0,
          item_name: product.name,
          item_brand: product.manufacturer,
        },
      ],
    };

    this.push(event);
  }

  trackViewItemList(item: Product, page: DataLayerPageType) {
    const event: DataLayerEvent = {
      event: DataLayerEventType.ItemListView,
      item_list_id: page,
      items: [
        {
          item_id: item.sku,
          item_name: item.name,
          price: item.salePrice?.value,
          quantity: 0,
        },
      ],
    };

    this.push(event);
  }

  trackOrder(basket: BasketView) {
    const event: DataLayerEvent = {
      event: DataLayerEventType.Purchase,
      currency: basket.purchaseCurrency,
      purchase: {
        products: [],
        actionField: {
          id: basket.id,
          affiliation: basket.payment?.displayName,
          revenue: basket.totals.total.gross,
          tax: basket.totals.taxTotal.value,
          shipping: basket.totals.shippingTotal.gross,
          coupon: basket.promotionCodes?.toString(),
        },
      },
    };

    // add products
    // tslint:disable-next-line: no-any
    const productData: Observable<any>[] = [];
    const mergedLineItems = this.mergeDuplicateLineItemViews(basket.lineItems);
    mergedLineItems.map(item => productData.push(this.getProductData(item.productSKU, item.quantity.value)));
    combineLatest(productData)
      .pipe(take(1))
      .subscribe((products: DataLayerProduct[]) => {
        products.forEach(product => event.purchase.products.push(product));
      });

    this.push(event);
  }

  trackCamCardCreate(camCard: CamCard, products: Product[]) {
    this.push(this.buildEventDataFromCamCard(DataLayerEventType.CamCardCreate, camCard, products));
  }

  trackCamCardEdit(camCard: CamCard, products: Product[]) {
    this.push(this.buildEventDataFromCamCard(DataLayerEventType.CamCardEdit, camCard, products));
  }

  trackCamCardAddItem(camCard: CamCard, products: Product[]) {
    this.push(this.buildEventDataFromCamCard(DataLayerEventType.CamCardAddItem, camCard, products));
  }

  trackCamCardDelete(camCardId: string) {
    this.push({
      event: DataLayerEventType.CamCardDelete,
      item_list_id: camCardId,
    });
  }

  /**
   * Private methods
   */

  private push(event) {
    try {
      if (
        dataLayer &&
        this.featureToggleService.enabled('tracking') &&
        this.cookiesService.cookieConsentFor('tracking')
      ) {
        dataLayer.push(event);
      }
    } catch (err) {
      console.error('We could not push your event. Tracking has not been initialized properly.', err, event);
    }
  }

  private getProductData(sku: string, quantity?: number): Observable<DataLayerProduct> {
    return this.store.pipe(select(getProduct, { sku })).pipe(
      whenTruthy(),
      map(product => ({
        id: product.sku,
        name: product.name,
        price: product.salePrice?.value,
        brand: product.manufacturer,
        category: product.defaultCategory.name,
        variant: undefined,
        quantity,
      }))
    );
  }

  private mergeDuplicateLineItemViews(items: LineItemView[]): LineItemView[] {
    const mergedItems: LineItemView[] = [];
    items.forEach(item => {
      if (mergedItems.some(c => c.productSKU === item.productSKU)) {
        const targetItem = { ...mergedItems.find(c => c.productSKU === item.productSKU) };
        const updatedItem = {
          ...mergedItems.find(c => c.productSKU === item.productSKU),
          quantity: { ...targetItem.quantity, value: targetItem.quantity.value + item.quantity.value },
        };
        const i = mergedItems.indexOf(mergedItems.find(c => c.productSKU === item.productSKU));
        mergedItems[i] = updatedItem;
      } else {
        mergedItems.push(item);
      }
    });
    return mergedItems;
  }

  private buildEventDataFromBasket(
    eventType: DataLayerEventType,
    basket: BasketView,
    products: Product[] = []
  ): DataLayerEvent {
    return {
      event: eventType,
      currency: basket.purchaseCurrency,
      value: basket.lineItems.reduce((prev, curr) => prev + curr.price.net, 0),
      items: basket.lineItems.map(item =>
        this.getItemDataFormBasketItem(
          item,
          products.find(p => p && p.sku === item.productSKU)
        )
      ),
    };
  }

  private getItemDataFormBasketItem(item: LineItemView, product?: Product): DataLayerItem {
    return {
      item_id: item.productSKU,
      currency: item.price.currency,
      discount: 0,
      index: item.position,
      price: item.price.net,
      quantity: item.quantity.value,
      item_name: product ? product.name : undefined,
      item_brand: product ? product.manufacturer : undefined,
    };
  }

  private buildEventDataFromCamCard(
    eventType: DataLayerEventType,
    camCard: CamCard,
    products: Product[] = []
  ): DataLayerEvent {
    const items = camCard.camCardItems
      ? camCard.camCardItems.map(item => {
          const dataLayerItem: DataLayerItem = {
            item_id: item.product.sku,
            discount: 0,
            index: item.position,
            quantity: item.quantity,
            item_name: item.product.name,
          };
          const product = products ? products.find(p => p && p.sku === item.product.sku) : undefined;
          if (product) {
            dataLayerItem.currency = product.salePrice?.currency;
            dataLayerItem.price = product.salePrice?.value;
            dataLayerItem.item_brand = product.manufacturer;
          }
          return dataLayerItem;
        })
      : [];
    return {
      event: eventType,
      items,
      item_list_id: camCard.id,
    };
  }
}
