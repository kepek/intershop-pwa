import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { CamfilChannelToggleDirective } from 'camfil-pwa/directives/camfil-channel-toggle.directive';
import { CamfilConfigurationFacade } from 'camfil-pwa/facades/camfil-configuration.facade';
import { CamfilChannelConfiguration } from 'camfil-pwa/models/camfil-channel-configuration/camfil-channel-configuration.model';
import { getCamfilConfigurationState } from 'camfil-pwa/store/camfil-configuration';
import { MockComponent, MockDirective } from 'ng-mocks';
import { Observable, of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AppFacade } from 'ish-core/facades/app.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { BasketView } from 'ish-core/models/basket/basket.model';
import { Order } from 'ish-core/models/order/order.model';
import { createOrderSuccess } from 'ish-core/store/customer/orders/orders.actions';
import { BasketInfoComponent } from 'ish-shared/components/basket/basket-info/basket-info.component';
import { CamfilBasketValidationResultsComponent } from 'ish-shared/components/basket/camfil-basket-validation-results/camfil-basket-validation-results.component';
import { CamfilCheckoutBucketComponent } from 'ish-shared/components/camfil-checkout-bucket/camfil-checkout-bucket.component';
import { CamfilCheckoutSummaryComponent } from 'ish-shared/components/camfil-checkout-summary/camfil-checkout-summary.component';
import { CamfilShoppingBucketEmptyComponent } from 'ish-shared/components/camfil-shopping-bucket-empty/camfil-shopping-bucket-empty.component';
import { CamfilErrorMessageComponent } from 'ish-shared/components/common/camfil-error-message/camfil-error-message.component';
import { CamfilLoadingComponent } from 'ish-shared/components/common/camfil-loading/camfil-loading.component';
import { CamfilModalDialogComponent } from 'ish-shared/components/common/camfil-modal-dialog/camfil-modal-dialog.component';

import { CamCardsFacade } from '../../extensions/cam-cards/facades/cam-cards.facade';

import { CamfilCheckoutGuestFormComponent } from './camfil-checkout-guest-form/camfil-checkout-guest-form.component';
import { CamfilCheckoutHeaderComponent } from './camfil-checkout-header/camfil-checkout-header.component';
import { CamfilCheckoutOnestepPageComponent } from './camfil-checkout-onestep-page.component';
import { CamfilCheckoutPaymentComponent } from './camfil-checkout-payment/camfil-checkout-payment.component';
import { CamfilCheckoutToolbarComponent } from './camfil-checkout-toolbar/camfil-checkout-toolbar.component';

describe('Camfil Checkout Onestep Page Component', () => {
  let fixture: ComponentFixture<CamfilCheckoutOnestepPageComponent>;
  let component: CamfilCheckoutOnestepPageComponent;
  let element: HTMLElement;
  let appFacadeMock: AppFacade;
  let camCardFacadeMock: CamCardsFacade;
  let checkoutFacade: CheckoutFacade;
  let shoppingFacadeMock: ShoppingFacade;
  let camfilConfigurationFacadeMock: CamfilConfigurationFacade;
  let actions$: Observable<Action>;

  const configuration: CamfilChannelConfiguration = {
    languages: ['sv_SE', 'en_GB'],
    zipCodeRegExp: '^\\d$',
    channelCode: 'SE',
    currency: 'SEK',
    icmChannel: 'Camfil-CamfilSE-Site',
    continueShoppingUrl: '/account/camcards',
    showCountryFieldOnAddressForms: false,
    showAddToCamCardButtonForNonLoggedInUser: true,
  };

  const camCardDetails = {
    name: 'testing cam cards',
    id: '.SKsEQAE4FIAAAFuNiUBWx0d',
    itemsCount: 0,
  };

  const basketDetails: BasketView = {
    id: 'basket_test',
    totals: {
      discountTotal: {
        type: 'PriceItem',
        gross: 100,
        net: 80,
        currency: '',
      },
      itemTotal: {
        type: 'PriceItem',
        gross: 100,
        net: 80,
        currency: '',
      },
      total: {
        type: 'PriceItem',
        gross: 100,
        net: 80,
        currency: '',
      },
      isEstimated: false,
    },
  };

  const selectedOrder: Order = {
    id: '1',
    documentNo: '1',
    creationDate: 1,
    customer: '1',
    orderCreation: {
      status: 'COMPLETED',
    },
    statusCode: 'NEW',
    status: '1',
    totals: {
      total: {
        gross: 141796.98,
        net: 141796.98,
        type: 'PriceItem',
        currency: 'USD',
      },
      discountTotal: {
        gross: 141796.98,
        net: 141796.98,
        type: 'PriceItem',
        currency: 'USD',
      },
      itemTotal: {
        gross: 141796.98,
        net: 141796.98,
        type: 'PriceItem',
        currency: 'USD',
      },
      isEstimated: false,
    },
  };

  beforeEach(async () => {
    appFacadeMock = mock(AppFacade);
    camCardFacadeMock = mock(CamCardsFacade);
    checkoutFacade = mock(CheckoutFacade);
    shoppingFacadeMock = mock(ShoppingFacade);
    camfilConfigurationFacadeMock = mock(CamfilConfigurationFacade);

    TestBed.configureTestingModule({
      providers: [{ provide: CamfilConfigurationFacade, useFactory: () => instance(camfilConfigurationFacadeMock) }],
    });

    await TestBed.configureTestingModule({
      declarations: [
        CamfilCheckoutOnestepPageComponent,
        MockComponent(BasketInfoComponent),
        MockComponent(CamfilBasketValidationResultsComponent),
        MockComponent(CamfilCheckoutBucketComponent),
        MockComponent(CamfilCheckoutHeaderComponent),
        MockComponent(CamfilCheckoutSummaryComponent),
        MockComponent(CamfilCheckoutToolbarComponent),
        MockComponent(CamfilLoadingComponent),
        MockComponent(CamfilModalDialogComponent),
        MockComponent(CamfilShoppingBucketEmptyComponent),
        MockDirective(CamfilChannelToggleDirective),
        MockDirective(CamfilCheckoutGuestFormComponent),
        MockDirective(CamfilCheckoutPaymentComponent),
        MockDirective(CamfilErrorMessageComponent),
      ],
      imports: [RouterTestingModule],
      providers: [
        { provide: AppFacade, useFactory: () => instance(appFacadeMock) },
        { provide: CamCardsFacade, useFactory: () => instance(camCardFacadeMock) },
        { provide: CheckoutFacade, useFactory: () => instance(checkoutFacade) },
        { provide: ShoppingFacade, useFactory: () => instance(shoppingFacadeMock) },
        provideMockStore({
          selectors: [{ selector: getCamfilConfigurationState, value: configuration }],
        }),
        provideMockActions(() => actions$),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilCheckoutOnestepPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    when(appFacadeMock.getCurrencyByChannel$).thenReturn(of('EUR'));
    when(shoppingFacadeMock.productAdded$).thenReturn(of(true));

    when(camCardFacadeMock.currentCamCard$).thenReturn(of(camCardDetails));
    when(camCardFacadeMock.camCards$).thenReturn(of([camCardDetails]));
    when(camCardFacadeMock.customers$).thenReturn(of([]));

    when(checkoutFacade.buckets$).thenReturn(of([]));
    when(checkoutFacade.basketValidationResults$).thenReturn(
      of({
        valid: false,
        adjusted: false,
      })
    );
    when(checkoutFacade.allBuckets$).thenReturn(of([]));
    when(checkoutFacade.emptyBuckets$).thenReturn(of([]));
    when(checkoutFacade.selectedOrder$).thenReturn(of(selectedOrder));
    when(checkoutFacade.basket$).thenReturn(of(basketDetails));
    when(checkoutFacade.submittedBasket$).thenReturn(of(undefined));
    when(checkoutFacade.submittedBuckets$).thenReturn(of(undefined));
    when(checkoutFacade.isFreightCostInvalid$).thenReturn(of(false));
    when(checkoutFacade.eligiblePaymentMethods$()).thenReturn(of([]));
  });

  it('should be created', () => {
    const action = createOrderSuccess({ order: { id: '123' } as Order });
    actions$ = of(action);

    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
