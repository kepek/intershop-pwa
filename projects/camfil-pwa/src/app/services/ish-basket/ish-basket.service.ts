import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { CamfilConfigurationFacade } from 'camfil-pwa/facades/camfil-configuration.facade';
import { Observable, throwError } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';

import { AppFacade } from 'ish-core/facades/app.facade';
import { Address } from 'ish-core/models/address/address.model';
import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { BasketExtensionData } from 'ish-core/models/basket-extension/basket-extension.interface';
import { BasketExtension } from 'ish-core/models/basket-extension/basket-extension.model';
import { BasketInfoMapper } from 'ish-core/models/basket-info/basket-info.mapper';
import { BasketInfo } from 'ish-core/models/basket-info/basket-info.model';
import { BasketData } from 'ish-core/models/basket/basket.interface';
import { BasketMapper } from 'ish-core/models/basket/basket.mapper';
import { Basket } from 'ish-core/models/basket/basket.model';
import { BucketData } from 'ish-core/models/bucket/bucket.interface';
import { BucketMapper } from 'ish-core/models/bucket/bucket.mapper';
import { Bucket } from 'ish-core/models/bucket/bucket.model';
import { CustomerDeliveryTerm } from 'ish-core/models/customer/customer.interface';
import { LineItem } from 'ish-core/models/line-item/line-item.model';
import { ApiService } from 'ish-core/services/api/api.service';
import { BasketService } from 'ish-core/services/basket/basket.service';
import { OrderService } from 'ish-core/services/order/order.service';

export type IshBasketIncludeType =
  | 'invoiceToAddress'
  | 'commonShipToAddress'
  | 'commonShippingMethod'
  | 'discounts'
  | 'lineItems_discounts'
  | 'lineItems'
  | 'payments'
  | 'payments_paymentMethod'
  | 'payments_paymentInstrument'
  | 'camfilProductLineItems';

export type IshMergeBasketIncludeType =
  | 'targetBasket'
  | 'targetBasket_invoiceToAddress'
  | 'targetBasket_commonShipToAddress'
  | 'targetBasket_commonShippingMethod'
  | 'targetBasket_discounts'
  | 'targetBasket_lineItems_discounts'
  | 'targetBasket_lineItems'
  | 'targetBasket_payments'
  | 'targetBasket_payments_paymentMethod'
  | 'targetBasket_payments_paymentInstrument';

export type IshValidationBasketIncludeType =
  | 'basket'
  | 'basket_invoiceToAddress'
  | 'basket_commonShipToAddress'
  | 'basket_commonShippingMethod'
  | 'basket_discounts'
  | 'basket_lineItems_discounts'
  | 'basket_lineItems'
  | 'basket_payments'
  | 'basket_payments_paymentMethod'
  | 'basket_payments_paymentInstrument';

@Injectable({ providedIn: 'root' })
export class IshBasketService extends BasketService {
  constructor(
    apiService: ApiService,
    orderService: OrderService,
    private ishAppFacade: AppFacade,
    private ishApiService: ApiService,
    // @ts-ignore // TODO (extMlk): remove @ts-ignore when in use
    private ishStore: Store,
    // @ts-ignore // TODO (extMlk): remove @ts-ignore when in use
    private camfilConfigurationFacade: CamfilConfigurationFacade
  ) {
    super(apiService, orderService);
  }

  /**
   * http header for Basket API v1
   */
  private ishBasketHeaders = new HttpHeaders({
    'content-type': 'application/json',
    Accept: 'application/vnd.intershop.basket.v1+json',
  });

  private camfilBasketHeaders = new HttpHeaders({
    'content-type': 'application/vnd.intershop.basket.v1+json',
    Accept: 'application/vnd.intershop.basket.v1+json',
  });

  private reloadBasketIncludes: IshBasketIncludeType[] = ['lineItems', 'camfilProductLineItems'];

  private ishAllBasketIncludes: IshBasketIncludeType[] = [
    'invoiceToAddress',
    'commonShipToAddress',
    'commonShippingMethod',
    'discounts',
    'lineItems_discounts',
    'lineItems',
    'payments',
    'payments_paymentMethod',
    'payments_paymentInstrument',
    'camfilProductLineItems',
  ];

  // @ts-ignore // TODO (extMlk): remove @ts-ignore when in use
  private ishAllTargetBasketIncludes: IshMergeBasketIncludeType[] = [
    'targetBasket',
    'targetBasket_invoiceToAddress',
    'targetBasket_commonShipToAddress',
    'targetBasket_commonShippingMethod',
    'targetBasket_discounts',
    'targetBasket_lineItems_discounts',
    'targetBasket_lineItems',
    'targetBasket_payments',
    'targetBasket_payments_paymentMethod',
    'targetBasket_payments_paymentInstrument',
  ];

  // @ts-ignore // TODO (extMlk): remove @ts-ignore when in use
  private ishAllBasketValidationIncludes: IshValidationBasketIncludeType[] = [
    'basket',
    'basket_invoiceToAddress',
    'basket_commonShipToAddress',
    'basket_commonShippingMethod',
    'basket_discounts',
    'basket_lineItems_discounts',
    'basket_lineItems',
    'basket_payments',
    'basket_payments_paymentMethod',
    'basket_payments_paymentInstrument',
  ];

  /**
   * Get the basket for the current user.
   * @returns         The basket.
   */
  reloadBasket(): Observable<Basket> {
    const params = new HttpParams().set('include', this.reloadBasketIncludes.join());

    return this.ishApiService
      .get<BasketData>(`baskets/current`, {
        headers: this.ishBasketHeaders,
        params,
      })
      .pipe(map(BasketMapper.fromData));
  }

  addLineItemAttribute(basketId: string, lineItemId: string, bucketId: string, attribute: Attribute) {
    return this.ishApiService
      .post(`baskets/${basketId}/items/${lineItemId}/attributes`, attribute, {
        headers: this.camfilBasketHeaders,
      })
      .pipe(map(() => ({ lineItemId, bucketId, attribute })));
  }

  updateLineItemAttributes(basketId: string, lineItemId: string, bucketId: string, attribute: Attribute) {
    return this.ishApiService
      .patch(`baskets/${basketId}/items/${lineItemId}/attributes/${attribute.name}`, attribute, {
        headers: this.camfilBasketHeaders,
      })
      .pipe(map(() => ({ lineItemId, bucketId, attribute })));
  }

  deleteLineItemAttributes(basketId: string, lineItemId: string, bucketId: string, attributeName: string) {
    return this.ishApiService
      .delete(`baskets/${basketId}/items/${lineItemId}/attributes/${attributeName}`, {
        headers: this.camfilBasketHeaders,
      })
      .pipe(map(() => ({ lineItemId, bucketId, attributeName })));
  }

  /**
   * Get warehouse calendar.
   * @returns         The basket.
   */
  getWarehouseCalendar() {
    const currentDate = new Date();
    const futureDate = new Date();

    futureDate.setDate(futureDate.getDate() + 1000);

    return this.ishAppFacade.getCountryCodeByChannel$.pipe(
      take(1),
      switchMap(countryCode =>
        this.ishApiService.post('calendar', {
          startDate: currentDate,
          endDate: futureDate,
          state: 'Closed',
          countryCode,
        })
      )
    );
  }

  getBuckets(basket: Basket): Observable<Bucket[]> {
    const params = new HttpParams().set('include', 'all');

    return this.ishApiService
      .get<BucketData>(`baskets/current/buckets`, {
        headers: this.ishBasketHeaders,
        params,
      })
      .pipe(map(buckets => BucketMapper.fromListData(buckets, basket)));
  }

  /**
   * Move product to another bucket and update position.
   * @param basketId  The basket id.
   * @param updatedLineItem  Updated product.
   * @param targetBucket  Updated product.
   * @returns
   */
  camfilDragLineItem(basketId: string, updatedLineItem: LineItem, targetBucket: Bucket) {
    const params = new HttpParams().set('include', this.ishAllBasketIncludes.join());
    const itemToSend = {
      position: updatedLineItem.position,
      shipToAddress: { id: targetBucket.deliveryAddressId },
    };
    return this.ishApiService
      .post(`baskets/${basketId}/items/${updatedLineItem.id}/camfil?${params}`, itemToSend)
      .pipe(map(BasketMapper.fromData));
  }

  getBasketAddresses(): Observable<Address[]> {
    return this.ishApiService
      .get<{ data: Address[] }>(`baskets/current/addresses`, {
        headers: this.ishBasketHeaders,
      })
      .pipe(map(addresses => addresses.data));
  }

  updateBucket(basketId: string, addressId: string, basketExtension: BasketExtension): Observable<BasketExtensionData> {
    return this.ishApiService.post(`baskets/${basketId}/camfil/${addressId}`, {
      ...basketExtension,
    });
  }

  /**
   * Adds a list of items with the given sku and quantity to the given basket.
   * @param items     The list of product SKU and quantity pairs to be added to the basket.
   */
  addItemsToBasket(
    items: {
      sku: string;
      quantity: number;
      unit: string;
      shippingMethod?: string;
      shipToAddress?: string;
      lineItemAttributes?: Attribute[];
    }[],
    calculated?: boolean
  ): Observable<BasketInfo[]> {
    if (!items) {
      return throwError('addItemsToBasket() called without items');
    }
    const body = items.map(item => {
      const attributes = item.lineItemAttributes || [];
      return {
        product: item.sku,
        quantity: {
          value: item.quantity,
          unit: item.unit,
        },
        shipToAddress: item.shipToAddress,
        shippingMethod: item.shippingMethod,
        attributes,
        calculated: !!calculated,
      };
    });

    return this.ishApiService
      .post(`baskets/current/items`, body, {
        headers: this.ishBasketHeaders,
      })
      .pipe(map(BasketInfoMapper.fromInfo));
  }

  getLineItemAttributes(basketId: string, lineItemId: string, bucketId: string) {
    const params = new HttpParams().set('include', 'all');
    return this.ishApiService
      .get(`baskets/${basketId}/items/${lineItemId}/attributes`, {
        headers: this.ishBasketHeaders,
        params,
      })
      .pipe(
        map((payload: { data: Attribute[]; links }) => {
          const { data } = payload;
          const attributes = data;
          return { attributes, lineItemId, bucketId };
        })
      );
  }

  deleteBucket(basketId: string, bucketId: string) {
    return this.ishApiService.delete(`baskets/${basketId}/buckets/${bucketId}`, {
      headers: this.ishBasketHeaders,
    });
  }

  doubleBucketItemsQuantity(basketId: string, bucketId: string) {
    const body = {
      doubleBucketItemsQuantity: true,
    };

    const options = {
      headers: this.ishBasketHeaders,
    };

    return this.ishApiService.patch(`baskets/${basketId}/buckets/${bucketId}`, body, options);
  }

  // tslint:disable-next-line:force-jsdoc-comments
  // TODO (extMlk): Make sure to abstract it from here to camfil-pwa
  loadCustomerDeliveryTerm(customerId: string): Observable<CustomerDeliveryTerm> {
    if (!customerId) {
      return throwError('loadCustomerDeliveryTerm() called without customerId');
    }

    return this.ishApiService.get<CustomerDeliveryTerm>(`camfilcustomers/${customerId}/deliveryterm`);
  }

  deleteBasket(basketId: string) {
    return this.ishApiService.delete(`baskets/${basketId}`, {
      headers: this.ishBasketHeaders,
    });
  }
}
