import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { FeatureToggleService } from 'ish-core/feature-toggle.module';
import { BasketView } from 'ish-core/models/basket/basket.model';
import { LineItemView } from 'ish-core/models/line-item/line-item.model';
import { Product } from 'ish-core/models/product/product.model';
import { getProduct } from 'ish-core/store/shopping/products';
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
  constructor(private store: Store, private featureToggleService: FeatureToggleService) {}

  trackBeginCheckout(basket: BasketView) {
    this.push(this.buildEventDataFromBasket(DataLayerEventType.BeginCheckout, basket));
  }

  trackCartAddItem(basket: BasketView) {
    this.push(this.buildEventDataFromBasket(DataLayerEventType.CartAddItem, basket));
  }

  trackCartRemoveItem(itemId: string, basket: BasketView) {
    const item = basket.lineItems.find(i => i.id === itemId);
    const event: DataLayerEvent = {
      event: DataLayerEventType.CartRemoveItem,
      currency: basket.purchaseCurrency,
      value: item?.totals.total.gross,
      items: [this.getItemDataFormBasketItem(item)],
    };
    this.push(event);
  }

  trackCamCardCreate(camCard: CamCard) {
    this.push(this.buildEventDataFromCamCard(DataLayerEventType.CamCardCreate, camCard));
  }

  trackCamCardEdit(camCard: CamCard) {
    this.push(this.buildEventDataFromCamCard(DataLayerEventType.CamCardEdit, camCard));
  }

  trackCamCardDelete(camCardId: string) {
    this.push({
      event: DataLayerEventType.CamCardDelete,
      item_list_id: camCardId,
    });
  }

  trackViewCart(basket: BasketView) {
    this.push(this.buildEventDataFromBasket(DataLayerEventType.CartView, basket));
  }

  trackViewItem(item: Product) {
    const event: DataLayerEvent = {
      event: DataLayerEventType.ItemView,
      item_list_name: item.name,
      page_type: DataLayerPageType.ProductDetail,
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

  /**
   * Private methods
   */

  private push(event) {
    try {
      if (dataLayer && this.featureToggleService.enabled('tracking')) {
        dataLayer.push(event);
      }
    } catch (err) {
      console.error('We could not push your event. Tracking has not been initialized properly.', err);
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

  private buildEventDataFromBasket(eventType: DataLayerEventType, basket: BasketView): DataLayerEvent {
    return {
      event: eventType,
      currency: basket.purchaseCurrency,
      value: basket.totals.total.gross,
      items: basket.lineItems.map(item => this.getItemDataFormBasketItem(item)),
    };
  }

  private getItemDataFormBasketItem(item: LineItemView): DataLayerItem {
    return {
      item_id: item.id,
      currency: item.price.currency,
      discount: 0,
      index: item.position,
      price: item.price.gross,
      quantity: item.quantity.value,
    };
  }

  private buildEventDataFromCamCard(eventType: DataLayerEventType, camCard: CamCard): DataLayerEvent {
    const items: DataLayerItem[] = camCard.camCardItems
      ? camCard.camCardItems.map(item => ({
          item_id: item.product.sku,
          item_name: item.product.name,
          quantity: item.quantity,
          index: item.position,
        }))
      : [];
    return {
      event: eventType,
      items,
      item_list_id: camCard.id,
    };
  }
}
