import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { BasketView } from 'ish-core/models/basket/basket.model';
import { CamfilCamCardModalComponent } from 'ish-shared/components/common/camfil-cam-card-modal/camfil-cam-card-modal.component';
import { CamfilCityFieldComponent } from 'ish-shared/components/common/camfil-city-field/camfil-city-field.component';
import { CamfilErrorComponent } from 'ish-shared/components/common/camfil-error/camfil-error.component';
import { CamfilLoadingComponent } from 'ish-shared/components/common/camfil-loading/camfil-loading.component';
import { CamfilSmallCtaModalComponent } from 'ish-shared/components/common/camfil-small-cta-modal/camfil-small-cta-modal.component';
import { CamfilProductQuantityComponent } from 'ish-shared/components/product/camfil-product-quantity/camfil-product-quantity.component';
import { ZipCodeComponent } from 'ish-shared/components/zip-code/zip-code.component';
import { CamfilCounterComponent } from 'ish-shared/forms/components/camfil-counter/camfil-counter.component';

import { CamCardsFacade } from '../../../extensions/cam-cards/facades/cam-cards.facade';
import { ArticleDetailsComponent } from '../../../extensions/cam-cards/shared/add-product-to-cam-card-modal/article-details/article-details.component';
import { CreateOrderProductModalComponent } from '../../../extensions/cam-cards/shared/add-product-to-cart-modal/create-order-product-modal/create-order-product-modal.component';
import { OrderFormComponent } from '../../../extensions/cam-cards/shared/add-product-to-cart-modal/create-order-product-modal/order-form/order-form.component';
import { CreateOrderProductSuccessComponent } from '../../../extensions/cam-cards/shared/add-product-to-cart-modal/create-order-product-success/create-order-product-success.component';

import { CamfilCheckoutToolbarComponent } from './camfil-checkout-toolbar.component';
import { CreateNewCamcardComponent } from './create-new-camcard/create-new-camcard.component';
import { CreateOrderButtonComponent } from './create-order-button/create-order-button.component';
import { PrintOrderComponent } from './print-order/print-order.component';

describe('Camfil Checkout Toolbar Component', () => {
  let component: CamfilCheckoutToolbarComponent;
  let fixture: ComponentFixture<CamfilCheckoutToolbarComponent>;
  let element: HTMLElement;

  let camCardFacadeMock: CamCardsFacade;
  let checkoutFacadeMock: CheckoutFacade;
  let shoppingFacadeMock: ShoppingFacade;

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

  beforeEach(async () => {
    camCardFacadeMock = mock(CamCardsFacade);
    checkoutFacadeMock = mock(CheckoutFacade);
    shoppingFacadeMock = mock(ShoppingFacade);

    await TestBed.configureTestingModule({
      declarations: [
        CamfilCheckoutToolbarComponent,
        MockComponent(ArticleDetailsComponent),
        MockComponent(CamfilCamCardModalComponent),
        MockComponent(CamfilCityFieldComponent),
        MockComponent(CamfilCounterComponent),
        MockComponent(CamfilErrorComponent),
        MockComponent(CamfilLoadingComponent),
        MockComponent(CamfilProductQuantityComponent),
        MockComponent(CamfilSmallCtaModalComponent),
        MockComponent(CreateNewCamcardComponent),
        MockComponent(CreateOrderButtonComponent),
        MockComponent(CreateOrderProductModalComponent),
        MockComponent(CreateOrderProductSuccessComponent),
        MockComponent(OrderFormComponent),
        MockComponent(PrintOrderComponent),
        MockComponent(ZipCodeComponent),
      ],
      providers: [
        { provide: CamCardsFacade, useFactory: () => instance(camCardFacadeMock) },
        { provide: CheckoutFacade, useFactory: () => instance(checkoutFacadeMock) },
        { provide: ShoppingFacade, useFactory: () => instance(shoppingFacadeMock) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilCheckoutToolbarComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    when(camCardFacadeMock.camCard$).thenReturn(of([camCardDetails]));
    when(camCardFacadeMock.virtualCamCard$).thenReturn(of(camCardDetails));
    when(checkoutFacadeMock.buckets$).thenReturn(of([]));
    when(checkoutFacadeMock.basket$).thenReturn(of(basketDetails));
    when(shoppingFacadeMock.productAdded$).thenReturn(of(true));
    when(shoppingFacadeMock.basketAddresses$).thenReturn(of([]));
    when(shoppingFacadeMock.productUpdated$).thenReturn(of(false));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
