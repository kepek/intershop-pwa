import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { BasketView } from 'ish-core/models/basket/basket.model';
import { CamfilCamCardModalComponent } from 'ish-shared/components/common/camfil-cam-card-modal/camfil-cam-card-modal.component';
import { CamfilErrorComponent } from 'ish-shared/components/common/camfil-error/camfil-error.component';
import { CamfilSmallCtaModalComponent } from 'ish-shared/components/common/camfil-small-cta-modal/camfil-small-cta-modal.component';
import { CamfilProductQuantityComponent } from 'ish-shared/components/product/camfil-product-quantity/camfil-product-quantity.component';
import { CamfilCounterComponent } from 'ish-shared/forms/components/camfil-counter/camfil-counter.component';

import { CamCardsFacade } from '../../../extensions/cam-cards/facades/cam-cards.facade';
import { CreateOrderModalComponent } from '../../../extensions/cam-cards/shared/add-to-cart-modal/create-order-modal/create-order-modal.component';
import { OrderFormComponent } from '../../../extensions/cam-cards/shared/add-to-cart-modal/create-order-modal/order-form/order-form.component';
import { CreateOrderSuccessComponent } from '../../../extensions/cam-cards/shared/add-to-cart-modal/create-order-success/create-order-success.component';
import { ArticleDetailsComponent } from '../../../extensions/cam-cards/shared/select-cam-card-modal/article-details/article-details.component';

import { CamfillCheckoutToolbarComponent } from './camfill-checkout-toolbar.component';
import { CreateNewCamcardComponent } from './create-new-camcard/create-new-camcard.component';
import { CreateOrderButtonComponent } from './create-order-button/create-order-button.component';

describe('Camfill Checkout Toolbar Component', () => {
  let component: CamfillCheckoutToolbarComponent;
  let fixture: ComponentFixture<CamfillCheckoutToolbarComponent>;
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
        CamfilCounterComponent,
        CamfilErrorComponent,
        CamfilProductQuantityComponent,
        CamfilSmallCtaModalComponent,
        CamfillCheckoutToolbarComponent,
        CreateNewCamcardComponent,
        CreateOrderButtonComponent,
        CreateOrderModalComponent,
        CreateOrderSuccessComponent,
        OrderFormComponent,
      ],
      providers: [
        { provide: CamCardsFacade, useFactory: () => instance(camCardFacadeMock) },
        { provide: CheckoutFacade, useFactory: () => instance(checkoutFacadeMock) },
        { provide: ShoppingFacade, useFactory: () => instance(shoppingFacadeMock) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfillCheckoutToolbarComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    when(camCardFacadeMock.camCard$).thenReturn(of([camCardDetails]));
    when(camCardFacadeMock.virtualCamCard$).thenReturn(of(camCardDetails));
    when(checkoutFacadeMock.buckets$).thenReturn(of([]));
    when(checkoutFacadeMock.basket$).thenReturn(of(basketDetails));
    when(shoppingFacadeMock.productAdded$).thenReturn(of(true));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
