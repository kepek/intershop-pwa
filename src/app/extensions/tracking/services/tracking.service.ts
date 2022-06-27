import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { FeatureToggleService } from 'ish-core/feature-toggle.module';
import { BasketView } from 'ish-core/models/basket/basket.model';
import { LineItemView } from 'ish-core/models/line-item/line-item.model';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { getProduct, getProducts } from 'ish-core/store/shopping/products';
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

  trackBeginCheckout(basket: BasketView) {
    this.getProductsFromBasket(basket).subscribe(products =>
      this.push(this.buildEventDataFromBasket(DataLayerEventType.BeginCheckout, basket, products))
    );
  }

  trackCartAddItem(basket: BasketView) {
    this.getProductsFromBasket(basket).subscribe(products =>
      this.push(this.buildEventDataFromBasket(DataLayerEventType.CartAddItem, basket, products))
    );
  }

  trackCartRemoveItem(basket: BasketView) {
    this.getProductsFromBasket(basket).subscribe(products =>
      this.push(this.buildEventDataFromBasket(DataLayerEventType.CartRemoveItem, basket, products))
    );
  }

  trackViewCart(basket: BasketView) {
    this.push(this.buildEventDataFromBasket(DataLayerEventType.CartView, basket));
  }

  trackViewItem(sku: string) {
    this.getProducts([sku]).subscribe(products => {
      if (!products || !products.length) {
        return;
      }
      const product = products[0];
      this.push({
        event: DataLayerEventType.ItemView,
        currency: product.salePrice.currency,
        value: product.salePrice.value,
        items: [
          {
            item_id: product.sku,
            discount: 0,
            index: 0,
            price: product.salePrice.value,
            quantity: 0,
            item_name: product.name,
            item_brand: product.manufacturer,
            item_category: product.defaultCategory()?.name,
          },
        ],
      });
    });
  }

  trackViewItemList(item: ProductView, page: DataLayerPageType) {
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

  trackCamCardCreate(camCard: CamCard) {
    this.getProductsFromCamCard(camCard).subscribe(products =>
      this.push(this.buildEventDataFromCamCard(DataLayerEventType.CamCardCreate, camCard, products))
    );
  }

  trackCamCardEdit(camCard: CamCard) {
    this.getProductsFromCamCard(camCard).subscribe(products =>
      this.push(this.buildEventDataFromCamCard(DataLayerEventType.CamCardEdit, camCard, products))
    );
  }

  trackCamCardAddItem(camCard: CamCard) {
    this.getProductsFromCamCard(camCard).subscribe(products =>
      this.push(this.buildEventDataFromCamCard(DataLayerEventType.CamCardAddItem, camCard, products))
    );
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

  private getProducts(skus: string[]): Observable<ProductView[]> {
    return this.store.pipe(select(getProducts, { skus }), take(1));
  }

  private getProductsFromBasket(basket: BasketView): Observable<ProductView[]> {
    return this.getProducts(basket.lineItems.map(item => item.productSKU));
  }

  private buildEventDataFromBasket(
    eventType: DataLayerEventType,
    basket: BasketView,
    products: ProductView[] = []
  ): DataLayerEvent {
    return {
      event: eventType,
      currency: basket.purchaseCurrency,
      value: basket.lineItems.reduce((prev, curr) => prev + curr.salePrice?.net * curr.quantity.value, 0),
      items: basket.lineItems.map(item =>
        this.getItemDataFormBasketItem(
          item,
          products.find(p => p && p.sku === item.productSKU)
        )
      ),
    };
  }

  private getItemDataFormBasketItem(item: LineItemView, product?: ProductView): DataLayerItem {
    return {
      item_id: item.productSKU,
      discount: 0,
      index: item.position,
      price: product?.salePrice?.value,
      quantity: item.quantity.value,
      item_name: product?.name,
      item_brand: product?.manufacturer,
      item_category: product?.defaultCategory()?.name,
    };
  }

  private getProductsFromCamCard(camCard: CamCard): Observable<ProductView[]> {
    return this.getProducts(camCard.camCardItems.map(item => item.product.sku));
  }

  private buildEventDataFromCamCard(
    eventType: DataLayerEventType,
    camCard: CamCard,
    products: ProductView[] = []
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
            dataLayerItem.price = product.salePrice?.value;
            dataLayerItem.item_brand = product.manufacturer;
            dataLayerItem.item_category = product.defaultCategory()?.name;
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
