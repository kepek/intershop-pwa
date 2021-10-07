import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { distinct, distinctUntilChanged, filter, map, take, takeUntil, takeWhile } from 'rxjs/operators';
import { CamCardsFacade } from 'src/app/extensions/cam-cards/facades/cam-cards.facade';

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
  confirmedBasket$ = new ReplaySubject<BasketView>(1);
  confirmedBuckets$ = new ReplaySubject<Bucket[]>(1);
  basketLoading$: Observable<boolean>;
  ordersLoading$: Observable<boolean>;
  validationResults$: Observable<BasketValidationResultType>;
  isConfirmed = false;

  private isValid = false;

  private destroy$ = new Subject<void>();

  constructor(
    private checkoutFacade: CheckoutFacade,
    private shoppingFacade: ShoppingFacade,
    private camCardsFacade: CamCardsFacade,
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

    // because of editOrderForm
    this.camCardsFacade.customers$
      .pipe(
        filter(customers => !customers.length),
        take(1)
      )
      .subscribe(() => {
        this.camCardsFacade.loadCustomers();
      });

    this.initBasket();
  }

  // only rerender the whole bucket when number of included lineItems changes
  trackByLineItems(_, bucket: Bucket): number {
    return bucket.lineItems.length;
  }

  // tslint:disable-next-line:force-jsdoc-comments

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.checkoutFacade.setCheckoutFocusedElement('');
  }

  private initBasket() {
    this.validationResults$
      .pipe(
        takeWhile(() => !this.isValid),
        takeUntil(this.destroy$)
      )
      .subscribe(result => {
        if (result?.valid) {
          this.checkoutFacade.getWarehouseCalendar();
          this.shoppingFacade.loadBasketAddresses();
          this.isValid = true;
        }
      });

    this.basket$
      .pipe(
        whenTruthy(),
        filter(basket => !!basket),
        takeUntil(this.destroy$)
      )
      .subscribe((basket: BasketView) => {
        if (!this.isConfirmed) {
          this.confirmedBasket$.next(basket);
        }
      });

    this.buckets$
      .pipe(
        whenTruthy(),
        filter(buckets => !!buckets?.length),
        takeWhile(() => !this.isConfirmed),
        takeUntil(this.destroy$)
      )
      .subscribe((buckets: Bucket[]) => {
        this.confirmedBuckets$.next(buckets);
      });

    this.confirmedBuckets$
      .pipe(
        map(buckets => buckets.map(bucket => bucket?.customer?.id)),
        distinct(),
        distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
        takeUntil(this.destroy$)
      )
      .subscribe(customerIds => {
        customerIds.forEach(customerId => {
          this.checkoutFacade.loadCustomerDeliveryTerm(customerId);
        });
      });

    // tslint:disable-next-line:no-intelligence-in-artifacts
    this.updates$.pipe(ofType(createOrderSuccess), takeUntil(this.destroy$)).subscribe(() => {
      this.isConfirmed = true;
      this.confirmedBuckets$
        .pipe(
          map(confirmedBuckets =>
            confirmedBuckets.reduce(
              (acc, { createdFromCamCardId }) => (createdFromCamCardId ? [...acc, createdFromCamCardId] : acc),
              []
            )
          ),
          whenTruthy(),
          take(1)
        )
        .subscribe(camCardIds => {
          camCardIds.forEach(camCardId => {
            this.camCardsFacade.updateCamCardAttribute(camCardId, {
              lastDeliveryDate: new Date().toISOString(),
            });
          });
        });
    });
  }
}
