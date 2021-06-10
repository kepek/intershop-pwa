import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { BasketView } from 'ish-core/models/basket/basket.model';
import { LineItemView } from 'ish-core/models/line-item/line-item.model';
import { getProduct } from 'ish-core/store/shopping/products';
import { whenTruthy } from 'ish-core/utils/operators';

import { DataLayerEvent, DataLayerEventType, DataLayerProduct } from '../models/data-layer-event.type';

// tslint:disable-next-line: no-any
declare var dataLayer: any;

/**
 *  Add events to dataLayer for GTM
 */
@Injectable({ providedIn: 'root' })
export class TrackingService {
  constructor(private store: Store) {}

  trackPurchase(basket: BasketView) {
    const event: DataLayerEvent = {
      event: DataLayerEventType.Purchase,
      ecommerce: {
        currencyCode: basket.purchaseCurrency,
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
        products.forEach(product => event.ecommerce.purchase.products.push(product));
      });

    dataLayer.push(event);
  }

  /**
   * Private methods
   */

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
}
