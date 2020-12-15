import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AppFacade } from 'ish-core/facades/app.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { BasketView } from 'ish-core/models/basket/basket.model';
import { CamfilBreadcrumbComponent } from 'ish-shared/components/common/camfil-breadcrumb/camfil-breadcrumb.component';

import { CamCardsFacade } from '../../extensions/cam-cards/facades/cam-cards.facade';

import { CamfilCheckoutListComponent } from './camfil-checkout-list/camfil-checkout-list.component';
import { CamfilCheckoutSummaryComponent } from './camfil-checkout-summary/camfil-checkout-summary.component';
import { CamfillCheckoutHeaderComponent } from './camfill-checkout-header/camfill-checkout-header.component';
import { CamfillCheckoutToolbarComponent } from './camfill-checkout-toolbar/camfill-checkout-toolbar.component';
import { CheckoutPageComponent } from './checkout-page.component';

describe('Checkout Page Component', () => {
  let fixture: ComponentFixture<CheckoutPageComponent>;
  let component: CheckoutPageComponent;
  let element: HTMLElement;
  let checkoutFacade: CheckoutFacade;
  let camCardFacadeMock: CamCardsFacade;

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

  beforeEach(async () => {
    camCardFacadeMock = mock(CamCardsFacade);
    checkoutFacade = mock(CheckoutFacade);

    await TestBed.configureTestingModule({
      declarations: [
        CheckoutPageComponent,
        MockComponent(CamfilBreadcrumbComponent),
        MockComponent(CamfilCheckoutListComponent),
        MockComponent(CamfilCheckoutSummaryComponent),
        MockComponent(CamfillCheckoutHeaderComponent),
        MockComponent(CamfillCheckoutToolbarComponent),
      ],
      imports: [RouterTestingModule],
      providers: [
        { provide: CheckoutFacade, useFactory: () => instance(checkoutFacade) },
        { provide: CamCardsFacade, useFactory: () => instance(camCardFacadeMock) },
        { provide: ShoppingFacade, useFactory: () => instance(mock(ShoppingFacade)) },
        { provide: AppFacade, useFactory: () => instance(mock(AppFacade)) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    when(camCardFacadeMock.currentCamCard$).thenReturn(of(camCardDetails));
    when(camCardFacadeMock.camCard$).thenReturn(of([camCardDetails]));

    when(checkoutFacade.buckets$).thenReturn(of([]));
    when(checkoutFacade.emptyBuckets$).thenReturn(of([]));
    when(checkoutFacade.basket$).thenReturn(of(basketDetails));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
