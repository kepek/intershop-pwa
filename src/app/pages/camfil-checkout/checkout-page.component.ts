import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { AttributeGroupTypes } from 'ish-core/models/attribute-group/attribute-group.types';
import { AttributeHelper } from 'ish-core/models/attribute/attribute.helper';
import { BasketValidationResultType } from 'ish-core/models/basket-validation/basket-validation.model';
import { BasketView } from 'ish-core/models/basket/basket.model';
import { Bucket } from 'ish-core/models/basket/bucket.model';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { ProductCompletenessLevel } from 'ish-core/models/product/product.model';
import { createOrderSuccess } from 'ish-core/store/customer/orders/orders.actions';
import { whenTruthy } from 'ish-core/utils/operators';

import { CamCard } from '../../extensions/cam-cards/models/cam-card/cam-card.model';

@Component({
  templateUrl: './checkout-page.component.html',
  styleUrls: ['./checkout-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class CheckoutPageComponent implements OnInit, OnDestroy {
  basket$: Observable<BasketView>;
  basketId: string;
  shippingMethodId: string;
  buckets$: Observable<any[]>;
  buckets: Bucket[];
  basket: BasketView;
  emptyBuckets: Bucket[];
  basketLoading$: Observable<boolean>;
  ordersLoading$: Observable<boolean>;
  validationResults$: Observable<BasketValidationResultType>;
  validation = false;

  selectedOrder$: Observable<any>;

  private destroy$ = new Subject<void>();

  camCards: CamCard[];

  unavailableProducts = {};

  constructor(
    private checkoutFacade: CheckoutFacade,
    private shoppingFacade: ShoppingFacade,
    private cdr: ChangeDetectorRef,
    private updates$: Actions
  ) {}

  ngOnInit() {
    this.checkoutFacade.setBasketPayment('ISH_INVOICE');
    this.initBasket();
    this.shoppingFacade.loadBasketAddresses();
    this.checkoutFacade.start();
  }

  initBasket() {
    this.basket$ = this.checkoutFacade.basket$;
    this.buckets$ = this.checkoutFacade.buckets$;
    this.basketLoading$ = this.checkoutFacade.ordersLoading$;
    this.validationResults$ = this.checkoutFacade.basketValidationResults$;
    this.selectedOrder$ = this.checkoutFacade.selectedOrder$;

    this.basket$.pipe(whenTruthy(), takeUntil(this.destroy$)).subscribe((basket: BasketView) => {
      this.basketId = basket.id;
      this.basket = basket;
      this.shippingMethodId = basket.commonShippingMethod?.id;
      this.validation = false;
      this.cdr.detectChanges();
    });

    this.buckets$.pipe(whenTruthy(), takeUntil(this.destroy$)).subscribe((buckets: Bucket[]) => {
      if (!this.buckets && buckets.length) {
        buckets
          .reduce((acc, item) => (acc.includes(item.customer.id) ? acc : [...acc, item.customer.id]), [])
          .forEach(customerId => this.checkoutFacade.loadCustomerDeliveryTerm(customerId));
      }
      this.buckets = buckets;
      this.cdr.detectChanges();

      const bucketsWithoutDate = [];

      buckets.forEach(order => {
        const defaultDeliveryDate = this.setFullDeliveryDate(order);

        const basketId = order.basket;
        const shipAddressId = order.deliveryAddressId;
        const deliveryDateValue = AttributeHelper.formatDeliveryDate(new Date(defaultDeliveryDate));

        const basketExtensionUpdate = {
          ...order,
          deliveryDate: deliveryDateValue,
          isPartialDelivery: true,
        };

        if (!order.deliveryDate?.length && deliveryDateValue !== 'NaN-aN-aN' && basketExtensionUpdate.customer) {
          bucketsWithoutDate.push({
            basketId,
            addressId: shipAddressId,
            basketExtension: basketExtensionUpdate,
          });
        }
      });

      if (bucketsWithoutDate.length) {
        this.shoppingFacade.updateBucketsQueue(bucketsWithoutDate);
      }
    });

    this.checkoutFacade.emptyBuckets$.pipe(takeUntil(this.destroy$)).subscribe(emptyBuckets => {
      this.emptyBuckets = emptyBuckets;
    });

    this.updates$.pipe(ofType(createOrderSuccess), takeUntil(this.destroy$)).subscribe(() => {
      this.validation = true;
    });
  }

  setFullDeliveryDate(order) {
    /** Get earliest delivery date for every line item */
    let items = order && order.lineItems;

    if (items?.length) {
      items = items.map(li => {
        const earliestDeliveryDate = this.getDeliveryDate(li.productSKU);
        return { ...li, earliestDeliveryDate };
      });
      return Math.max.apply(
        Math,
        items.map(o => o.earliestDeliveryDate)
      );
    } else {
      return new Date().toISOString();
    }
  }

  getDeliveryDate(lineItemId: string) {
    const productDetail$ = this.shoppingFacade.product$(lineItemId, ProductCompletenessLevel.List);
    let delivery;
    productDetail$.pipe(take(1), takeUntil(this.destroy$)).subscribe((res: ProductView) => {
      const today = new Date();
      let daysTillReady: number;
      if (res.attributeGroups && res.attributeGroups[AttributeGroupTypes.ProductsListLabelAttributes]) {
        daysTillReady = Number(
          res.attributeGroups[AttributeGroupTypes.ProductsListLabelAttributes].attributes.find(
            a => a.name?.toLowerCase() === 'deliverydays'
          ).value
        );
      } else {
        // TODO To remove. Should use only Deliverydays when attribute value is provided
        daysTillReady = res.readyForShipmentMin;
      }
      delivery = today.setDate(today.getDate() + daysTillReady);
    });

    return delivery;
  }

  handleProductLoad(product) {
    if (!product?.availability) {
      this.unavailableProducts[product.sku] = product;
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
