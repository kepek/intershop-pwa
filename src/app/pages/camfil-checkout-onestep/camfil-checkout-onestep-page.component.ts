// tslint:disable: ish-ordered-imports project-structure ban-specific-imports

import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { combineLatest, Observable, Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  startWith,
  take,
  takeUntil,
  takeWhile,
  withLatestFrom,
} from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { AppFacade } from 'ish-core/facades/app.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { BasketExtensionData } from 'ish-core/models/basket-extension/basket-extension.interface';
import { BasketTotal } from 'ish-core/models/basket-total/basket-total.model';
import { BasketValidationResultType } from 'ish-core/models/basket-validation/basket-validation.model';
import { Basket, BasketView } from 'ish-core/models/basket/basket.model';
import { Bucket } from 'ish-core/models/bucket/bucket.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { PaymentInstrument } from 'ish-core/models/payment-instrument/payment-instrument.model';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';
import { whenTruthy } from 'ish-core/utils/operators';

import { CamCardsFacade } from '../../extensions/cam-cards/facades/cam-cards.facade';

import { CamfilCheckoutGuestFormComponent } from './camfil-checkout-guest-form/camfil-checkout-guest-form.component';
import { BasketMapper } from 'ish-core/models/basket/basket.mapper';
import { isEqual } from 'lodash-es';
import { CamfilModalDialogComponent } from 'ish-shared/components/common/camfil-modal-dialog/camfil-modal-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CamfilQuoteCreatedDialogComponent } from './camfil-quote-created-dialog/camfil-quote-created-dialog.component';
import { IshCheckoutFacade } from 'camfil-pwa/facades/ish-checkout.facade';

@Component({
  templateUrl: './camfil-checkout-onestep-page.component.html',
  styleUrls: ['./camfil-checkout-onestep-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilCheckoutOnestepPageComponent implements OnInit, AfterViewInit, OnDestroy {
  basket$: Observable<BasketView>;
  basketError$: Observable<HttpError>;
  basketLoading$: Observable<boolean>;
  buckets$: Observable<Bucket[]>;
  checkoutStep$: Observable<number>;
  emptyBuckets$: Observable<Bucket[]>;
  allBuckets$: Observable<Bucket[]>;
  isEditable$: Observable<boolean>;
  isLoggedIn$: Observable<boolean>;
  isEmpty$: Observable<boolean>;
  ordersLoading$: Observable<boolean>;
  paymentMethods$: Observable<PaymentMethod[]>;
  priceType$: Observable<'gross' | 'net'>;
  submittedBasket$: Observable<Basket>;
  submittedBuckets$: Observable<Bucket[]>;
  basketTotals$: Observable<BasketTotal>;
  validationResults$: Observable<BasketValidationResultType>;
  isFreightCostInvalid$: Observable<boolean>;
  calculatedBasket$: Observable<boolean>;

  private isValid = false;
  private destroy$ = new Subject<void>();

  @ViewChild('guestForm') guestForm: CamfilCheckoutGuestFormComponent;
  @ViewChild('freightCostWarningDialog') freightCostWarningDialog: CamfilModalDialogComponent<unknown>;
  constructor(
    private appFacade: AppFacade,
    private accountFacade: AccountFacade,
    private checkoutFacade: CheckoutFacade,
    private shoppingFacade: ShoppingFacade,
    private camCardsFacade: CamCardsFacade,
    private ishCheckoutFacade: IshCheckoutFacade,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.calculatedBasket$ = this.ishCheckoutFacade.calculatedBasket$;

    this.basketLoading$ = this.checkoutFacade.basketLoading$;
    this.isLoggedIn$ = this.accountFacade.isLoggedIn$;
    this.basketError$ = this.checkoutFacade.basketError$;
    this.isFreightCostInvalid$ = this.checkoutFacade.isFreightCostInvalid$;
    this.ordersLoading$ = this.checkoutFacade.ordersLoading$;

    this.buckets$ = this.checkoutFacade.buckets$;
    this.checkoutStep$ = this.checkoutFacade.checkoutStep$;
    this.emptyBuckets$ = this.checkoutFacade.emptyBuckets$;

    this.paymentMethods$ = this.checkoutFacade.eligiblePaymentMethods$();
    this.priceType$ = this.checkoutFacade.priceType$;
    this.submittedBasket$ = this.checkoutFacade.submittedBasket$;
    this.submittedBuckets$ = this.checkoutFacade.submittedBuckets$;
    this.validationResults$ = this.checkoutFacade.basketValidationResults$;

    this.basket$ = this.checkoutFacade.basket$;

    this.basketTotals$ = this.basket$?.pipe(
      withLatestFrom(this.appFacade.getCurrencyByChannel$),
      map(([basket, currency]) => (basket?.totals?.itemTotal ? basket.totals : BasketMockData.getEmptyTotals(currency)))
    );

    this.allBuckets$ = this.checkoutFacade.allBuckets$;

    this.isEditable$ = this.submittedBasket$?.pipe(
      startWith(false),
      withLatestFrom(this.checkoutFacade.selectedOrder$),
      map(([submittedBasket, order]) => !submittedBasket || order.statusCode === 'RFQ')
    );

    this.isEmpty$ = this.allBuckets$?.pipe(map(allBuckets => allBuckets?.length === 0));

    this.submittedBasket$
      ?.pipe(
        startWith(false),
        whenTruthy(),
        withLatestFrom(this.checkoutFacade.selectedOrder$),
        map(([, order]) => order),
        filter(order => order.statusCode === 'RFQ'),
        debounceTime(500),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.dialog.open(CamfilQuoteCreatedDialogComponent));

    this.calculatedBasket$
      .pipe(
        filter(cal => cal),
        take(1)
      )
      .subscribe(() => {
        this.initBasket();
      });
  }

  ngAfterViewInit() {
    this.isFreightCostInvalid$?.pipe(takeUntil(this.destroy$)).subscribe(isFreightCostInvalid => {
      this.freightCostWarningDialog?.[isFreightCostInvalid ? 'show' : 'hide']();
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.checkoutFacade.setCheckoutFocusedElement('');
  }

  // tslint:disable-next-line:force-jsdoc-comments
  // only rerender the whole bucket when number of included lineItems changes
  trackByLineItems(_, bucket: Bucket): number {
    return bucket.lineItems.length;
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

  submit(orderType?: string) {
    this.guestForm?.validateGuestForm();
    if (orderType) {
      this.checkoutFacade.setBasketOrderType(orderType);
    }
    this.checkoutFacade.continue(5);
  }

  // tslint:disable-next-line:no-any
  updateGuestBucketAddress(guestFormValue: any) {
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
        const anonymousBasketData = BasketMapper.convertFormDataToAnonymousBasketData(guestFormValue);
        const basketExtensionData: BasketExtensionData = {
          contactPerson: bucket?.contactPerson,
          customer: bucket?.customer,
          anonymousBasketData,
        };

        this.shoppingFacade.updateBucket(basketId, bucket?.deliveryAddressId, basketExtensionData);
      });
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
        take(1),
        withLatestFrom(this.basket$),
        filter(([, basket]) => basket?.id && !basket?.payment && !!basket.lineItems.length),
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
        distinctUntilChanged(isEqual),
        takeUntil(this.destroy$)
      )
      .subscribe(customerIds => {
        customerIds.forEach(customerId => {
          this.checkoutFacade.loadCustomerDeliveryTerm(customerId);
        });
      });
  }
}
