import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { BasketValidationResultType } from 'ish-core/models/basket-validation/basket-validation.model';
import { BasketView } from 'ish-core/models/basket/basket.model';
import { Bucket } from 'ish-core/models/basket/bucket.model';
import { createOrderSuccess } from 'ish-core/store/customer/orders/orders.actions';
import { whenTruthy } from 'ish-core/utils/operators';

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

  unavailableProducts = {};

  constructor(
    private checkoutFacade: CheckoutFacade,
    private shoppingFacade: ShoppingFacade,
    private cdr: ChangeDetectorRef,
    private updates$: Actions
  ) {}

  get isEmptyBucketsVisible() {
    return this.emptyBuckets?.length;
  }

  ngOnInit() {
    this.checkoutFacade.checkCurrentBasket();
    this.checkoutFacade.setBasketPayment('ISH_INVOICE');
    this.checkoutFacade.getWarehouseCalendar();
    this.initBasket();
    this.shoppingFacade.loadBasketAddresses();
    this.checkoutFacade.start();
  }

  initBasket() {
    this.basket$ = this.checkoutFacade.basket$;
    this.buckets$ = this.checkoutFacade.buckets$;
    this.basketLoading$ = this.checkoutFacade.basketLoading$;
    this.ordersLoading$ = this.checkoutFacade.ordersLoading$;
    this.validationResults$ = this.checkoutFacade.basketValidationResults$;
    this.selectedOrder$ = this.checkoutFacade.selectedOrder$;

    this.basket$.pipe(whenTruthy(), takeUntil(this.destroy$)).subscribe((basket: BasketView) => {
      this.basketId = basket.id;
      this.basket = basket;
      this.shippingMethodId = basket.commonShippingMethod?.id;
      if (basket.lineItems?.length) {
        this.validation = false;
      }
      this.cdr.detectChanges();
    });

    this.buckets$.pipe(whenTruthy(), takeUntil(this.destroy$)).subscribe((buckets: Bucket[]) => {
      if (!this.buckets && buckets.length) {
        buckets
          .reduce((acc, item) => (acc.includes(item?.customer?.id) ? acc : [...acc, item?.customer?.id]), [])
          .forEach(customerId => this.checkoutFacade.loadCustomerDeliveryTerm(customerId));
      }
      this.buckets = buckets;
      this.cdr.detectChanges();
    });

    this.checkoutFacade.emptyBuckets$.pipe(takeUntil(this.destroy$)).subscribe(emptyBuckets => {
      this.emptyBuckets = emptyBuckets;
    });

    this.updates$.pipe(ofType(createOrderSuccess), takeUntil(this.destroy$)).subscribe(() => {
      this.validation = true;
    });
  }

  handleProductLoad(product) {
    if (!product?.availability) {
      this.unavailableProducts[product.sku] = product;
    }
  }

  /* only rerender the whole bucket when number of included lineItems changes */
  // tslint:disable-next-line: variable-name
  trackByItems(_index, item: Bucket): number {
    return item.lineItems.length;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.checkoutFacade.setCheckoutFocusedElement('');
  }
}
