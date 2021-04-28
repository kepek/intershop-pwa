import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { Basket, BasketView } from 'ish-core/models/basket/basket.model';
import { CamfilCamCardModalComponent } from 'ish-shared/components/common/camfil-cam-card-modal/camfil-cam-card-modal.component';
import { CamfilErrorComponent } from 'ish-shared/components/common/camfil-error/camfil-error.component';
import { CamfilSmallCtaModalComponent } from 'ish-shared/components/common/camfil-small-cta-modal/camfil-small-cta-modal.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';
import { CamfilProductQuantityComponent } from 'ish-shared/components/product/camfil-product-quantity/camfil-product-quantity.component';
import { ZipCodeComponent } from 'ish-shared/components/zip-code/zip-code.component';
import { CamfilCounterComponent } from 'ish-shared/forms/components/camfil-counter/camfil-counter.component';

import { CamCardsFacade } from '../../../extensions/cam-cards/facades/cam-cards.facade';
import { CreateOrderModalComponent } from '../../../extensions/cam-cards/shared/add-to-cart-modal/create-order-modal/create-order-modal.component';
import { OrderFormComponent } from '../../../extensions/cam-cards/shared/add-to-cart-modal/create-order-modal/order-form/order-form.component';
import { CreateOrderSuccessComponent } from '../../../extensions/cam-cards/shared/add-to-cart-modal/create-order-success/create-order-success.component';
import { ArticleDetailsComponent } from '../../../extensions/cam-cards/shared/select-cam-card-modal/article-details/article-details.component';
import { CamfilCheckoutToolbarComponent } from '../camfil-checkout-toolbar/camfil-checkout-toolbar.component';
import { CreateNewCamcardComponent } from '../camfil-checkout-toolbar/create-new-camcard/create-new-camcard.component';
import { CreateOrderButtonComponent } from '../camfil-checkout-toolbar/create-order-button/create-order-button.component';
import { PrintOrderComponent } from '../camfil-checkout-toolbar/print-order/print-order.component';

import { CamfilCheckoutHeaderComponent } from './camfil-checkout-header.component';

describe('Camfil Checkout Header Component', () => {
  let component: CamfilCheckoutHeaderComponent;
  let fixture: ComponentFixture<CamfilCheckoutHeaderComponent>;
  let element: HTMLElement;
  let basket: Basket;
  let buckets;
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
        ArticleDetailsComponent,
        CamfilCamCardModalComponent,
        CamfilCheckoutHeaderComponent,
        CamfilCheckoutToolbarComponent,
        CamfilCounterComponent,
        CamfilErrorComponent,
        CamfilProductQuantityComponent,
        CamfilSmallCtaModalComponent,
        MockComponent(CreateNewCamcardComponent),
        MockComponent(CreateOrderButtonComponent),
        MockComponent(CreateOrderModalComponent),
        MockComponent(CreateOrderSuccessComponent),
        MockComponent(LoadingComponent),
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
    fixture = TestBed.createComponent(CamfilCheckoutHeaderComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    basket = { id: '1' } as Basket;
    basket.totalProductQuantity = 8;
    basket.buckets = ['1', '2', '3'];
    buckets = [];

    component.basket = basket;
    component.buckets = buckets;
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
