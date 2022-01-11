// tslint:disable: ish-ordered-imports ban-specific-imports

import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { combineLatest, Observable, Subject } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  first,
  map,
  startWith,
  take,
  takeUntil,
  takeWhile,
  withLatestFrom,
} from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { BasketValidationResultType } from 'ish-core/models/basket-validation/basket-validation.model';
import { Basket, BasketView } from 'ish-core/models/basket/basket.model';
import { Bucket } from 'ish-core/models/bucket/bucket.model';

import { CamCardsFacade } from '../../extensions/cam-cards/facades/cam-cards.facade';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { PaymentInstrument } from 'ish-core/models/payment-instrument/payment-instrument.model';
import { whenTruthy } from 'ish-core/utils/operators';
import {
  BasketExtensionData,
  BasketExtensionGuestData,
} from 'ish-core/models/basket-extension/basket-extension.interface';
import { CamfilCheckoutGuestFormComponent } from './camfil-checkout-guest-form/camfil-checkout-guest-form.component';
import { AppFacade } from 'ish-core/facades/app.facade';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';
import { BasketTotal } from 'ish-core/models/basket-total/basket-total.model';
import { BasketSurchargeTypes } from 'ish-core/models/basket-surcharge/basket-surcharge.types';
import { BasketSurchargeHelper } from 'ish-core/models/basket-surcharge/basket-surcharge.helper';
import { PriceHelper } from 'ish-core/models/price/price.helper';

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
  isEmpty$: Observable<boolean>;
  ordersLoading$: Observable<boolean>;
  paymentMethods$: Observable<PaymentMethod[]>;
  priceType$: Observable<'gross' | 'net'>;
  submittedBasket$: Observable<Basket>;
  submittedBuckets$: Observable<Bucket[]>;
  basketTotals$: Observable<BasketTotal>;
  validationResults$: Observable<BasketValidationResultType>;

  private isValid = false;
  private destroy$ = new Subject<void>();

  @ViewChild('guestForm') guestForm: CamfilCheckoutGuestFormComponent;

  constructor(
    private appFacade: AppFacade,
    private accountFacade: AccountFacade,
    private checkoutFacade: CheckoutFacade,
    private shoppingFacade: ShoppingFacade,
    private camCardsFacade: CamCardsFacade
  ) {}

  ngOnInit() {
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

    this.basket$ = combineLatest([this.checkoutFacade.basket$, this.checkoutFacade.submittedBasket$]).pipe(
      map(([basket, submittedBasket]) => basket || submittedBasket)
    );

    this.basketTotals$ = this.basket$.pipe(
      withLatestFrom(this.appFacade.getCurrencyByChannel$),
      map(([basket, currency]) =>
        basket?.totals?.itemTotal ? basket.totals : BasketMockData.getEmptyTotals(currency)
      ),
      map(totals => {
        let bucketSurchargeTotalsByType = totals?.bucketSurchargeTotalsByType;

        const shippingDiscountSurcharge = BasketSurchargeHelper.select(
          bucketSurchargeTotalsByType,
          BasketSurchargeTypes.ShippingDiscount
        );

        const shippingFeeSurcharge = BasketSurchargeHelper.select(
          bucketSurchargeTotalsByType,
          BasketSurchargeTypes.ShippingDiscount
        );

        if (BasketSurchargeHelper.equal(shippingDiscountSurcharge, shippingFeeSurcharge)) {
          bucketSurchargeTotalsByType = bucketSurchargeTotalsByType
            ?.map(surcharge => ({ ...surcharge, strikethrough: surcharge?.amount.net <= 0 }))
            ?.map(surcharge => {
              switch (surcharge.displayName) {
                case BasketSurchargeTypes.ShippingFee:
                  return;
                case BasketSurchargeTypes.ShippingDiscount:
                  return { ...surcharge, amount: PriceHelper.invert(surcharge.amount) };
                default:
                  return surcharge;
              }
            })
            .filter(Boolean);
        }

        return { ...totals, bucketSurchargeTotalsByType };
      })
    );

    this.isSubmitted$ = this.submittedBasket$.pipe(
      startWith(false),
      map(basket => !!basket)
    );

    this.isEmpty$ = combineLatest([
      this.checkoutFacade.buckets$,
      this.checkoutFacade.emptyBuckets$,
      this.isSubmitted$,
    ]).pipe(
      map(([buckets, emptyBuckets, isSubmitted]) => {
        const b = buckets || emptyBuckets;
        return isSubmitted ? false : !b || b?.length === 0;
      })
    );

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

  submit() {
    this.guestForm?.validateGuestForm();
    this.checkErpEmployeeIdExists();
    this.checkoutFacade.continue(5);
  }

  updateGuestBucketAddress(guestBucketAddressData: BasketExtensionGuestData) {
    combineLatest([
      this.isLoggedIn$,
      this.checkoutFacade.basket$.pipe(map(basket => basket?.id)),
      this.buckets$.pipe(map(buckets => buckets?.[0])),
    ])
      .pipe(
        take(1),
        takeWhile(([isLoggedIn]) => !isLoggedIn),
        takeUntil(this.destroy$)
      )
      .subscribe(([, basketId, bucket]) => {
        const basketExtensionData: BasketExtensionData = {
          contactPerson: bucket?.contactPerson,
          customer: bucket?.customer,
          anonymousBasketData: guestBucketAddressData,
        };

        this.shoppingFacade.updateBucket(basketId, bucket?.deliveryAddressId, basketExtensionData);
      });
  }

  private checkErpEmployeeIdExists() {
    let erpEmployeeId;

    try {
      erpEmployeeId = JSON.parse(localStorage.getItem('erpEmployeeId'));
    } catch (err) {
      // NOOP
    }

    if (erpEmployeeId) {
      this.checkoutFacade.updateBasketExternalOrderReference(erpEmployeeId);
    }
  }

  private initBasket() {
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
        withLatestFrom(this.checkoutFacade.basket$),
        filter(([, basket]) => !basket?.payment),
        takeUntil(this.destroy$)
      )
      .subscribe(([pm]) => this.updateBasketPaymentMethod(pm.id));

    // if there is more than one eligible payment method set default as per configuration for logged in user
    this.paymentMethods$
      .pipe(
        filter(methods => methods?.length > 1),
        map(methods => methods.find(p => p.default)),
        first(),
        withLatestFrom(this.checkoutFacade.basket$, this.isLoggedIn$),
        filter(([, basket, isLoggedIn]) => !basket?.payment && isLoggedIn),
        takeUntil(this.destroy$)
      )
      .subscribe(([pm]) => this.updateBasketPaymentMethod(pm.id));

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

    this.buckets$
      .pipe(
        whenTruthy(),
        withLatestFrom(this.isLoggedIn$),
        map(([buckets, isLoggedIn]) =>
          isLoggedIn ? [...new Set(buckets.map(bucket => bucket?.customer?.id))].filter(Boolean) : []
        ),
        filter(customerIds => customerIds?.length > 0),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(customerIds => {
        customerIds.forEach(customerId => {
          this.checkoutFacade.loadCustomerDeliveryTerm(customerId);
        });
      });
  }
}
