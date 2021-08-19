import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Observable, Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { BasketValidationResultType } from 'ish-core/models/basket-validation/basket-validation.model';
import { BasketView } from 'ish-core/models/basket/basket.model';
import { Bucket } from 'ish-core/models/basket/bucket.model';
import { createOrderSuccess } from 'ish-core/store/customer/orders/orders.actions';
import { whenTruthy } from 'ish-core/utils/operators';

@Component({
  templateUrl: './camfil-checkout-page.component.html',
  styleUrls: ['./camfil-checkout-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilCheckoutPageComponent implements OnInit, OnDestroy {
  basket$: Observable<BasketView>;
  buckets$: Observable<Bucket[]>;
  emptyBuckets$: Observable<Bucket[]>;
  confirmedBuckets$: Observable<Bucket[]>;
  basketLoading$: Observable<boolean>;
  ordersLoading$: Observable<boolean>;
  validationResults$: Observable<BasketValidationResultType>;
  isConfirmed = false;

  private destroy$ = new Subject<void>();

  constructor(
    private checkoutFacade: CheckoutFacade,
    private shoppingFacade: ShoppingFacade,
    // tslint:disable-next-line:no-intelligence-in-artifacts
    private updates$: Actions
  ) {}

  ngOnInit() {
    this.basket$ = this.checkoutFacade.basket$;
    this.basketLoading$ = this.checkoutFacade.basketLoading$;
    this.buckets$ = this.checkoutFacade.buckets$;
    this.emptyBuckets$ = this.checkoutFacade.emptyBuckets$;
    this.ordersLoading$ = this.checkoutFacade.ordersLoading$;
    this.validationResults$ = this.checkoutFacade.basketValidationResults$;

    this.initBasket();
  }

  private initBasket() {
    this.validationResults$.pipe(takeUntil(this.destroy$)).subscribe(result => {
      if (result?.valid) {
        this.checkoutFacade.setBasketPayment('ISH_INVOICE');
        this.checkoutFacade.getWarehouseCalendar();
        this.shoppingFacade.loadBasketAddresses();
        this.checkoutFacade.start();
      }
    });

    this.basket$.pipe(whenTruthy(), takeUntil(this.destroy$)).subscribe((basket: BasketView) => {
      if (basket.lineItems?.length) {
        this.isConfirmed = false;
      }
    });

    this.confirmedBuckets$ = this.buckets$.pipe(
      filter(buckets => !!buckets?.length),
      map(buckets =>
        buckets.reduce((acc, bucket) => (acc.includes(bucket?.customer?.id) ? acc : [...acc, bucket?.customer?.id]), [])
      )
    );

    this.confirmedBuckets$.pipe(whenTruthy(), takeUntil(this.destroy$)).subscribe(buckets => {
      buckets.forEach(bucket => {
        if (bucket?.customer?.id) {
          this.checkoutFacade.loadCustomerDeliveryTerm(bucket.customer.id);
        }
      });
    });

    // tslint:disable-next-line:no-intelligence-in-artifacts
    this.updates$.pipe(ofType(createOrderSuccess), takeUntil(this.destroy$)).subscribe(() => {
      this.isConfirmed = true;
    });
  }

  // tslint:disable-next-line:force-jsdoc-comments
  // only rerender the whole bucket when number of included lineItems changes
  trackByLineItems(_, bucket: Bucket): number {
    return bucket.lineItems.length;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.checkoutFacade.setCheckoutFocusedElement('');
  }
}
