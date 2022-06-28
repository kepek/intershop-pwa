import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { skipWhile, take } from 'rxjs/operators';

import { FeatureToggleService } from 'ish-core/feature-toggle.module';
import { BasketView } from 'ish-core/models/basket/basket.model';
import { LineItemView } from 'ish-core/models/line-item/line-item.model';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { getProducts } from 'ish-core/store/shopping/products';
import { CookiesService } from 'ish-core/utils/cookies/cookies.service';

import { CamCard } from '../../cam-cards/models/cam-card/cam-card.model';
import { DataLayerEvent, DataLayerEventType, DataLayerItem, DataLayerPageType } from '../models/data-layer-event.type';

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

  trackBeginCheckout(basket: BasketView, pageType?: DataLayerPageType) {
    this.getProductsFromBasket(basket).subscribe(products =>
      this.push(this.buildEventDataFromBasket(DataLayerEventType.BeginCheckout, basket, products, pageType))
    );
  }

  trackCartAddItem(basket: BasketView, pageType?: DataLayerPageType) {
    this.getProductsFromBasket(basket).subscribe(products =>
      this.push(this.buildEventDataFromBasket(DataLayerEventType.CartAddItem, basket, products, pageType))
    );
  }

  trackCartRemoveItem(basket: BasketView, pageType?: DataLayerPageType) {
    this.getProductsFromBasket(basket).subscribe(products =>
      this.push(this.buildEventDataFromBasket(DataLayerEventType.CartRemoveItem, basket, products, pageType))
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
    this.getProductsFromBasket(basket).subscribe(products => {
      const event: DataLayerEvent = {
        ...this.buildEventDataFromBasket(DataLayerEventType.Purchase, basket, products),
        transaction_id: basket.id,
        tax: basket.totals.taxTotal.value,
        shipping: basket.totals.dutiesAndSurchargesTotal.net + basket.totals.shippingTotal.net,
        value: basket.totals.total.gross,
      };
      this.push(event);
    });
  }

  trackCamCardCreate(camCard: CamCard, pageType?: DataLayerPageType) {
    this.getProductsFromCamCard(camCard).subscribe(products =>
      this.push(
        this.buildEventDataFromCamCard(
          DataLayerEventType.CamCardCreate,
          { ...camCard, camCardItems: [] },
          products,
          pageType
        )
      )
    );
  }

  trackCamCardEdit(camCard: CamCard, pageType?: DataLayerPageType) {
    this.getProductsFromCamCard(camCard).subscribe(products =>
      this.push(
        this.buildEventDataFromCamCard(
          DataLayerEventType.CamCardEdit,
          { ...camCard, camCardItems: [] },
          products,
          pageType
        )
      )
    );
  }

  trackCamCardAddItem(camCard: CamCard, pageType?: DataLayerPageType) {
    this.getProductsFromCamCard(camCard).subscribe(products =>
      this.push(this.buildEventDataFromCamCard(DataLayerEventType.CamCardAddItem, camCard, products, pageType))
    );
  }

  trackCamCardDelete(camCardId: string, pageType?: DataLayerPageType) {
    const event: DataLayerEvent = {
      event: DataLayerEventType.CamCardDelete,
      item_list_id: camCardId,
      page_type: pageType,
    };
    this.push(event);
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

  private getProducts(skus: string[]): Observable<ProductView[]> {
    return this.store.pipe(
      select(getProducts, { skus }),
      skipWhile(products => products.filter(p => !p || !p.name).length > 0),
      take(1)
    );
  }

  private getProductsFromBasket(basket: BasketView): Observable<ProductView[]> {
    return this.getProducts(basket.lineItems.map(item => item.productSKU));
  }

  private buildEventDataFromBasket(
    eventType: DataLayerEventType,
    basket: BasketView,
    products: ProductView[] = [],
    pageType?: DataLayerPageType
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
      page_type: pageType,
    };
  }

  private getItemDataFormBasketItem(item: LineItemView, product?: ProductView): DataLayerItem {
    return {
      item_id: item.productSKU,
      discount: 0,
      index: item.position,
      price: product && product.salePrice ? product.salePrice.value : item.salePrice.net,
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
    products: ProductView[] = [],
    pageType?: DataLayerPageType
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
      page_type: pageType,
    };
  }
}
