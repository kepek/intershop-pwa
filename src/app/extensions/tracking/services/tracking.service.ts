import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, forkJoin, of } from 'rxjs';
import { map, mergeMap, skipWhile, take } from 'rxjs/operators';

import { FeatureToggleService } from 'ish-core/feature-toggle.module';
import { BasketTotal } from 'ish-core/models/basket-total/basket-total.model';
import { BasketView } from 'ish-core/models/basket/basket.model';
import { CategoryView } from 'ish-core/models/category-view/category-view.model';
import { LineItemView } from 'ish-core/models/line-item/line-item.model';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { getCategory, getSelectedCategory } from 'ish-core/store/shopping/categories';
import { getProducts } from 'ish-core/store/shopping/products';
import { CookiesService } from 'ish-core/utils/cookies/cookies.service';

import { CamCard } from '../../cam-cards/models/cam-card/cam-card.model';
import { QuoteDetails } from '../../cam-quotes/models/quote-details/quote-details.model';
import {
  DataLayerEvent,
  DataLayerEventType,
  DataLayerItem,
  DataLayerOrderType,
  DataLayerPageType,
} from '../models/data-layer-event.type';

// tslint:disable-next-line: no-any
declare var dataLayer: any;

interface CategoryInfo {
  category: CategoryView;
  parent?: CategoryInfo;
}

interface ProductInfo {
  product: ProductView;
  categoryInfo?: CategoryInfo;
}

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

  trackSelectItem(item: ProductView, pageType: DataLayerPageType) {
    this.getProducts([item.sku]).subscribe(([productInfo]) =>
      this.push({
        event: DataLayerEventType.ItemSelect,
        currency: productInfo.product?.salePrice?.currency,
        value: productInfo.product?.salePrice?.value,
        items: [
          {
            item_id: productInfo.product?.sku,
            discount: 0,
            index: 0,
            price: productInfo.product?.salePrice?.value,
            item_name: productInfo.product?.name,
            item_brand: productInfo.product?.manufacturer,
            item_category2: productInfo.categoryInfo?.category?.name,
            item_category: productInfo.categoryInfo?.parent?.category?.name,
          },
        ],
        page_type: pageType,
      })
    );
  }

  trackViewItem(item: ProductView) {
    this.getProducts([item.sku]).subscribe(([productInfo]) =>
      this.push({
        event: DataLayerEventType.ItemView,
        currency: productInfo.product?.salePrice?.currency,
        value: productInfo.product?.salePrice?.value,
        items: [
          {
            item_id: productInfo.product?.sku,
            discount: 0,
            index: 0,
            price: productInfo.product?.salePrice?.value,
            item_name: productInfo.product?.name,
            item_brand: productInfo.product?.manufacturer,
            item_category2: productInfo.categoryInfo?.category?.name,
            item_category: productInfo.categoryInfo?.parent?.category?.name,
          },
        ],
      })
    );
  }

  trackViewItemList(skus: string[], pageType: DataLayerPageType, pageId?: string) {
    this.getProducts(skus).subscribe(products => {
      const event: DataLayerEvent = {
        event: DataLayerEventType.ItemListView,
        item_list_id: pageId,
        page_type: pageType,
        items: products.map(productInfo => ({
          item_id: productInfo.product?.sku,
          discount: 0,
          index: 0,
          price: productInfo.product?.salePrice?.value,
          item_name: productInfo.product?.name,
          item_brand: productInfo.product?.manufacturer,
          item_category2: productInfo.categoryInfo?.category?.name,
          item_category: productInfo.categoryInfo?.parent?.category?.name,
        })),
      };

      this.push(event);
    });
  }

  trackViewItemListFromQuotation(quotation: QuoteDetails) {
    this.getProducts(quotation.items.map(item => item.productSKU)).subscribe(products => {
      const event: DataLayerEvent = {
        event: DataLayerEventType.ItemListView,
        page_type: DataLayerPageType.QuoteDetail,
        item_list_id: quotation.id,
        item_list_name: quotation.displayName,
        items: quotation.items.map((item, i) => {
          const dataLayerItem: DataLayerItem = {
            item_id: item.product.sku,
            discount: 0,
            index: i,
            quantity: item.quantity?.value,
            item_name: item.product.name,
          };
          const productInfo = products
            ? products.find(p => p && p.product && p.product.sku === item.product.sku)
            : undefined;
          if (productInfo) {
            dataLayerItem.price = productInfo.product.salePrice?.value;
            dataLayerItem.item_brand = productInfo.product.manufacturer;
            dataLayerItem.item_category = productInfo.categoryInfo?.category?.name;
            dataLayerItem.item_category2 = productInfo.categoryInfo?.parent?.category?.name;
          }
          return dataLayerItem;
        }),
      };

      this.push(event);
    });
  }

  trackViewItemListFromCamCard(camCard: CamCard) {
    this.getProductsFromCamCard(camCard).subscribe(products => {
      const event: DataLayerEvent = {
        event: DataLayerEventType.ItemListView,
        page_type: DataLayerPageType.QuoteDetail,
        item_list_id: camCard.id,
        item_list_name: camCard.name,
        items: camCard.camCardItems.map((item, i) => {
          const dataLayerItem: DataLayerItem = {
            item_id: item.product.sku,
            discount: 0,
            index: i,
            quantity: item.quantity,
            item_name: item.product.name,
          };
          const productInfo = products
            ? products.find(p => p && p.product && p.product.sku === item.product.sku)
            : undefined;
          if (productInfo) {
            dataLayerItem.price = productInfo.product.salePrice?.value;
            dataLayerItem.item_brand = productInfo.product.manufacturer;
            dataLayerItem.item_category = productInfo.categoryInfo?.category?.name;
            dataLayerItem.item_category2 = productInfo.categoryInfo?.parent?.category?.name;
          }
          return dataLayerItem;
        }),
      };

      this.push(event);
    });
  }

  trackOrder(basket: BasketView, orderType: DataLayerOrderType) {
    this.getProductsFromBasket(basket).subscribe(products => {
      const event: DataLayerEvent = {
        ...this.buildEventDataFromBasket(DataLayerEventType.Purchase, basket, products),
        transaction_id: basket.id,
        tax: basket.totals.taxTotal.value,
        shipping: this.extractShippingCosts(basket.totals),
        value: basket.totals.total.gross,
        order_type: orderType,
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

  private getProducts(skus: string[]): Observable<ProductInfo[]> {
    if (!skus || !skus.length) {
      return of([]);
    }

    return this.store.pipe(
      select(getProducts, { skus }),
      skipWhile(products => products.filter(p => !p || !p.name).length > 0),
      mergeMap(products =>
        forkJoin(
          products.map(product => {
            if (product.defaultCategory && product.defaultCategory()) {
              return this.getCategoryInfo(product.defaultCategory()).pipe(
                map(categoryInfo => ({ product, categoryInfo }))
              );
            }

            return this.store.pipe(
              select(getSelectedCategory),
              take(1),
              mergeMap(category =>
                !category
                  ? of({ product, categoryInfo: { category, parent: undefined } })
                  : this.getCategoryInfo(category).pipe(map(categoryInfo => ({ product, categoryInfo })))
              )
            );
          })
        )
      ),
      take(1)
    );
  }

  private getProductsFromBasket(basket: BasketView): Observable<ProductInfo[]> {
    return this.getProducts(basket.lineItems.map(item => item.productSKU));
  }

  private buildEventDataFromBasket(
    eventType: DataLayerEventType,
    basket: BasketView,
    products: ProductInfo[] = [],
    pageType?: DataLayerPageType
  ): DataLayerEvent {
    return {
      event: eventType,
      currency: basket.purchaseCurrency,
      value: basket.lineItems.reduce((prev, curr) => prev + curr.salePrice?.net * curr.quantity.value, 0),
      items: basket.lineItems.map(item =>
        this.getItemDataFormBasketItem(
          item,
          products.find(p => p && p.product && p.product.sku === item.productSKU)
        )
      ),
      page_type: pageType,
    };
  }

  private getItemDataFormBasketItem(item: LineItemView, productInfo?: ProductInfo): DataLayerItem {
    return {
      item_id: item.productSKU,
      discount: 0,
      index: item.position,
      price:
        productInfo && productInfo.product && productInfo.product.salePrice
          ? productInfo.product.salePrice.value
          : item.salePrice.net,
      quantity: item.quantity.value,
      item_name: productInfo?.product?.name,
      item_brand: productInfo?.product?.manufacturer,
      item_category2: productInfo?.categoryInfo?.category?.name,
      item_category: productInfo?.categoryInfo?.parent?.category?.name,
    };
  }

  private getProductsFromCamCard(camCard: CamCard): Observable<ProductInfo[]> {
    return this.getProducts(camCard.camCardItems.map(item => item.product.sku));
  }

  private buildEventDataFromCamCard(
    eventType: DataLayerEventType,
    camCard: CamCard,
    products: ProductInfo[] = [],
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
          const productInfo = products
            ? products.find(p => p && p.product && p.product.sku === item.product.sku)
            : undefined;
          if (productInfo) {
            dataLayerItem.price = productInfo.product.salePrice?.value;
            dataLayerItem.item_brand = productInfo.product.manufacturer;
            dataLayerItem.item_category = productInfo.categoryInfo?.category?.name;
            dataLayerItem.item_category2 = productInfo.categoryInfo?.parent?.category?.name;
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

  private getCategoryInfo(category: CategoryView): Observable<CategoryInfo> {
    if (category.categoryPath.length > 1) {
      return this.store.pipe(
        select(getCategory(category.categoryPath[category.categoryPath.length - 2])),
        take(1),
        mergeMap(parentCategory => this.getCategoryInfo(parentCategory).pipe(map(parent => ({ category, parent }))))
      );
    }

    return of({ category, parent: undefined });
  }

  private extractShippingCosts(totals: BasketTotal) {
    let shipping = 0;
    if (totals.dutiesAndSurchargesTotal) {
      shipping += totals.dutiesAndSurchargesTotal.net;
    }
    if (totals.shippingTotal) {
      shipping += totals.shippingTotal.net;
    }
    return shipping;
  }
}
