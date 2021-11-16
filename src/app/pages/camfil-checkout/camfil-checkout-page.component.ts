// tslint:disable: ish-ordered-imports ban-specific-imports

import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, filter, first, map, take, takeUntil, takeWhile, withLatestFrom } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { BasketValidationResultType } from 'ish-core/models/basket-validation/basket-validation.model';
import { Basket, BasketView } from 'ish-core/models/basket/basket.model';
import { Bucket } from 'ish-core/models/basket/bucket.model';

import { CamCardsFacade } from '../../extensions/cam-cards/facades/cam-cards.facade';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { PaymentInstrument } from 'ish-core/models/payment-instrument/payment-instrument.model';
import { BasketExtensions, GuestBasketExtensions } from 'ish-core/models/basket/basket.interface';

@Component({
  templateUrl: './camfil-checkout-page.component.html',
  styleUrls: ['./camfil-checkout-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilCheckoutPageComponent implements OnInit, OnDestroy {
  basket$: Observable<BasketView>;
  basketError$: Observable<HttpError>;
  basketLoading$: Observable<boolean>;
  buckets$: Observable<Bucket[]>;
  emptyBuckets$: Observable<Bucket[]>;
  isSubmitted$: Observable<boolean>;
  isLoggedIn$: Observable<boolean>;
  ordersLoading$: Observable<boolean>;
  paymentMethods$: Observable<PaymentMethod[]>;
  priceType$: Observable<'gross' | 'net'>;
  submittedBasket$: Observable<Basket>;
  submittedBuckets$: Observable<Bucket[]>;
  validationResults$: Observable<BasketValidationResultType>;

  private isValid = false;
  private destroy$ = new Subject<void>();

  constructor(
    private accountFacade: AccountFacade,
    private checkoutFacade: CheckoutFacade,
    private shoppingFacade: ShoppingFacade,
    private camCardsFacade: CamCardsFacade
  ) {}

  ngOnInit() {
    this.basket$ = this.checkoutFacade.basket$;
    this.basketError$ = this.checkoutFacade.basketError$;
    this.basketLoading$ = this.checkoutFacade.basketLoading$;
    this.buckets$ = this.checkoutFacade.buckets$;
    this.emptyBuckets$ = this.checkoutFacade.emptyBuckets$;
    this.isLoggedIn$ = this.accountFacade.isLoggedIn$;
    this.ordersLoading$ = this.checkoutFacade.ordersLoading$;
    this.paymentMethods$ = this.checkoutFacade.eligiblePaymentMethods$();
    this.priceType$ = this.checkoutFacade.priceType$;
    this.submittedBasket$ = this.checkoutFacade.submittedBasket$;
    this.submittedBuckets$ = this.checkoutFacade.submittedBuckets$;
    this.validationResults$ = this.checkoutFacade.basketValidationResults$;

    this.isSubmitted$ = this.submittedBasket$.pipe(map(basket => !!basket));

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
    combineLatest([
      this.isLoggedIn$,
      this.basket$.pipe(map(basket => basket?.id)),
      this.buckets$.pipe(map(buckets => buckets?.[0])),
    ])
      .pipe(
        take(1),
        takeWhile(([isLoggedIn]) => !isLoggedIn),
        takeUntil(this.destroy$)
      )
      .subscribe(([, basketId, bucket]) => {
        const updated: BasketExtensions = {
          ...bucket,
          ...guestBucketAddressData,
          anonymousBasketDataRO: guestBucketAddressData,
        };

        this.shoppingFacade.updateBucket(basketId, bucket?.deliveryAddressId, updated);
      });
  }

  private initBasket() {
    this.validationResults$
      .pipe(
        takeWhile(() => !this.isValid),
        withLatestFrom(this.isLoggedIn$),
        takeUntil(this.destroy$)
      )
      .subscribe(([result, isLoggedIn]) => {
        if (result?.valid && isLoggedIn) {
          this.checkoutFacade.getWarehouseCalendar();
          this.shoppingFacade.loadBasketAddresses();
          this.isValid = true;
        }
      });

    this.submittedBuckets$
      .pipe(
        withLatestFrom(this.isLoggedIn$),
        map(([buckets, isLoggedIn]) =>
          isLoggedIn ? [...new Set(buckets.map(bucket => bucket?.customer?.id))] : undefined
        ),
        distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
        takeUntil(this.destroy$)
      )
      .subscribe(customerIds => {
        customerIds?.filter(Boolean)?.forEach(customerId => {
          this.checkoutFacade.loadCustomerDeliveryTerm(customerId);
        });
      });
  }
}
