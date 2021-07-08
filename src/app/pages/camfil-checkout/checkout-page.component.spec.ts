import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockComponent } from 'ng-mocks';
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
import { CamfilLoadingComponent } from 'ish-shared/components/common/camfil-loading/camfil-loading.component';

import { CamCardsFacade } from '../../extensions/cam-cards/facades/cam-cards.facade';

import { CamfilCheckoutHeaderComponent } from './camfil-checkout-header/camfil-checkout-header.component';
import { CamfilCheckoutListComponent } from './camfil-checkout-list/camfil-checkout-list.component';
import { CamfilCheckoutSummaryComponent } from './camfil-checkout-summary/camfil-checkout-summary.component';
import { CamfilCheckoutToolbarComponent } from './camfil-checkout-toolbar/camfil-checkout-toolbar.component';
import { CamfilCheckoutValidationComponent } from './camfil-checkout-validation/camfil-checkout-validation.component';
import { CheckoutPageComponent } from './checkout-page.component';

describe('Checkout Page Component', () => {
  let fixture: ComponentFixture<CheckoutPageComponent>;
  let component: CheckoutPageComponent;
  let element: HTMLElement;
  let checkoutFacade: CheckoutFacade;
  let camCardFacadeMock: CamCardsFacade;
  let shoppingFacadeMock: ShoppingFacade;
  let actions$: Observable<Action>;

  const camCardDetails = {
    name: 'testing cam cards',
    id: '.SKsEQAE4FIAAAFuNiUBWx0d',
    itemsCount: 0,
  };

  const basketDetails: BasketView = {
    id: 'basket_test',
    totals: {
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
    statusCode: '1',
    status: '1',
    totals: {
      total: {
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
    camCardFacadeMock = mock(CamCardsFacade);
    checkoutFacade = mock(CheckoutFacade);
    shoppingFacadeMock = mock(ShoppingFacade);

    await TestBed.configureTestingModule({
      declarations: [
        CheckoutPageComponent,
        MockComponent(BasketInfoComponent),
        MockComponent(CamfilBasketValidationResultsComponent),
        MockComponent(CamfilCheckoutHeaderComponent),
        MockComponent(CamfilCheckoutListComponent),
        MockComponent(CamfilCheckoutSummaryComponent),
        MockComponent(CamfilCheckoutToolbarComponent),
        MockComponent(CamfilCheckoutValidationComponent),
        MockComponent(CamfilLoadingComponent),
      ],
      imports: [RouterTestingModule],
      providers: [
        { provide: CheckoutFacade, useFactory: () => instance(checkoutFacade) },
        { provide: CamCardsFacade, useFactory: () => instance(camCardFacadeMock) },
        { provide: ShoppingFacade, useFactory: () => instance(shoppingFacadeMock) },
        { provide: AppFacade, useFactory: () => instance(mock(AppFacade)) },
        { provide: AppFacade, useFactory: () => instance(mock(AppFacade)) },
        provideMockActions(() => actions$),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    when(shoppingFacadeMock.productAdded$).thenReturn(of(true));

    when(camCardFacadeMock.currentCamCard$).thenReturn(of(camCardDetails));
    when(camCardFacadeMock.camCard$).thenReturn(of([camCardDetails]));

    when(checkoutFacade.buckets$).thenReturn(of([]));
    when(checkoutFacade.basketValidationResults$).thenReturn(
      of({
        valid: false,
        adjusted: false,
      })
    );
    when(checkoutFacade.emptyBuckets$).thenReturn(of([]));
    when(checkoutFacade.selectedOrder$).thenReturn(of(selectedOrder));
    when(checkoutFacade.basket$).thenReturn(of(basketDetails));
  });

  it('should be created', () => {
    const action = createOrderSuccess({ order: { id: '123' } as Order });
    actions$ = of(action);

    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
