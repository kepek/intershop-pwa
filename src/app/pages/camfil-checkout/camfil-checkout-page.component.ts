// tslint:disable: ish-ordered-imports ban-specific-imports

import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { distinctUntilChanged, filter, first, map, take, takeUntil, takeWhile, withLatestFrom } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { BasketValidationResultType } from 'ish-core/models/basket-validation/basket-validation.model';
import { BasketView } from 'ish-core/models/basket/basket.model';
import { Bucket } from 'ish-core/models/basket/bucket.model';
import { Order } from 'ish-core/models/order/order.model';
import { whenTruthy } from 'ish-core/utils/operators';

import { CamCardsFacade } from '../../extensions/cam-cards/facades/cam-cards.facade';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { PaymentInstrument } from 'ish-core/models/payment-instrument/payment-instrument.model';
import { GuestBasketExtensions } from 'ish-core/models/basket/basket.interface';

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
  isLoggedIn$: Observable<boolean>;
  createdOrder$: Observable<Order>;
  basketError$: Observable<HttpError>;
  paymentMethods$: Observable<PaymentMethod[]>;
  priceType$: Observable<'gross' | 'net'>;

  isConfirmed = false;
  isLoggedIn = false;

  private isValid = false;
  private destroy$ = new Subject<void>();

  constructor(
    private accountFacade: AccountFacade,
    private checkoutFacade: CheckoutFacade,
    private shoppingFacade: ShoppingFacade,
    private camCardsFacade: CamCardsFacade
  ) {}

  ngOnInit() {
    this.isLoggedIn$ = this.accountFacade.isLoggedIn$;
    this.basket$ = this.checkoutFacade.basket$;
    this.basketLoading$ = this.checkoutFacade.basketLoading$;
    this.buckets$ = this.checkoutFacade.buckets$;
    this.emptyBuckets$ = this.checkoutFacade.emptyBuckets$;
    this.ordersLoading$ = this.checkoutFacade.ordersLoading$;
    this.validationResults$ = this.checkoutFacade.basketValidationResults$;
    this.createdOrder$ = this.checkoutFacade.createdOrder$;
    this.basketError$ = this.checkoutFacade.basketError$;
    this.priceType$ = this.checkoutFacade.priceType$;
    this.paymentMethods$ = this.checkoutFacade.eligiblePaymentMethods$();

    this.createdOrder$.pipe(takeUntil(this.destroy$)).subscribe(createdOrder => {
      this.isConfirmed = !!createdOrder;
    });

    this.isLoggedIn$.pipe(take(1), takeUntil(this.destroy$)).subscribe(isLoggedIn => (this.isLoggedIn = isLoggedIn));

    // because of editOrderForm
    this.camCardsFacade.customers$
      .pipe(
        filter(customers => !customers.length),
        take(1)
      )
      .subscribe(() => {
        this.camCardsFacade.loadCustomers();
      });

    // if there is only one eligible payment method without parameters, assign it automatically to the basket
    this.paymentMethods$
      .pipe(
        filter(methods => methods?.length === 1),
        map(methods => methods?.[0]),
        filter(pm => !pm.parameters),
        first(),
        withLatestFrom(this.basket$),
        filter(([, basket]) => !basket?.payment),
        takeUntil(this.destroy$)
      )
      .subscribe(([pm]) => this.updateBasketPaymentMethod(pm.id));

    this.initBasket();
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

  updateBasketPaymentMethod(paymentName: string) {
    this.checkoutFacade.setBasketPayment(paymentName);
  }

  createUserPaymentInstrument(instrument: PaymentInstrument) {
    this.checkoutFacade.createBasketPayment(instrument, true);
  }

  createPaymentInstrument(body: { paymentInstrument: PaymentInstrument; saveForLater: boolean }) {
    if (!body || !body.paymentInstrument) {
      return;
    }
    this.checkoutFacade.createBasketPayment(body.paymentInstrument, body.saveForLater);
  }

  deletePaymentInstrument(instrument: PaymentInstrument) {
    this.checkoutFacade.deleteBasketPayment(instrument);
  }

  /**
   * Validates the basket and jumps to the next checkout step (Review)
   */
  nextStep() {
    this.checkoutFacade.continue(4);
  }

  submitGuestCheckout(guestBucketAddressData: GuestBasketExtensions) {
    console.log('submitGuestCheckout', guestBucketAddressData);
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
        withLatestFrom(this.isLoggedIn$),
        map(([buckets, isLoggedIn]) =>
          isLoggedIn ? [...new Set(buckets.map(bucket => bucket?.customer?.id))] : undefined
        ),
        distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
        takeUntil(this.destroy$)
      )
      .subscribe(customerIds => {
        customerIds.filter(Boolean).forEach(customerId => {
          this.checkoutFacade.loadCustomerDeliveryTerm(customerId);
        });
      });
  }
}
