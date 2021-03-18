import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { BasketView } from 'ish-core/models/basket/basket.model';
import { Product } from 'ish-core/models/product/product.model';
import { CamfilCamCardModalComponent } from 'ish-shared/components/common/camfil-cam-card-modal/camfil-cam-card-modal.component';
import { CamfilErrorComponent } from 'ish-shared/components/common/camfil-error/camfil-error.component';
import { CamfilSmallCtaModalComponent } from 'ish-shared/components/common/camfil-small-cta-modal/camfil-small-cta-modal.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';
import { CamfilProductQuantityComponent } from 'ish-shared/components/product/camfil-product-quantity/camfil-product-quantity.component';
import { CamfilCounterComponent } from 'ish-shared/forms/components/camfil-counter/camfil-counter.component';

import { CamCardsFacade } from '../../../../../extensions/cam-cards/facades/cam-cards.facade';
import { AddToCartModalComponent } from '../../../../../extensions/cam-cards/shared/add-to-cart-modal/add-to-cart-modal.component';
import { CamCardModalDetailsComponent } from '../../../../../extensions/cam-cards/shared/add-to-cart-modal/cam-card-modal-details/cam-card-modal-details.component';
import { CreateOrderModalComponent } from '../../../../../extensions/cam-cards/shared/add-to-cart-modal/create-order-modal/create-order-modal.component';
import { OrderFormComponent } from '../../../../../extensions/cam-cards/shared/add-to-cart-modal/create-order-modal/order-form/order-form.component';
import { CreateOrderSuccessComponent } from '../../../../../extensions/cam-cards/shared/add-to-cart-modal/create-order-success/create-order-success.component';
import { ArticleDetailsComponent } from '../../../../../extensions/cam-cards/shared/select-cam-card-modal/article-details/article-details.component';

import { CamfilProductAddToBasketModalComponent } from './camfil-product-add-to-basket-modal.component';

describe('Camfil Product Add To Basket Modal Component', () => {
  let component: CamfilProductAddToBasketModalComponent;
  let fixture: ComponentFixture<CamfilProductAddToBasketModalComponent>;
  let element: HTMLElement;
  let shoppingFacadeMock: ShoppingFacade;
  let checkoutFacadeMock: CheckoutFacade;
  let accountFacadeMock: AccountFacade;
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
    shoppingFacadeMock = mock(ShoppingFacade);
    checkoutFacadeMock = mock(CheckoutFacade);
    accountFacadeMock = mock(AccountFacade);
    camCardFacadeMock = mock(CamCardsFacade);

    await TestBed.configureTestingModule({
      declarations: [
        AddToCartModalComponent,
        ArticleDetailsComponent,
        CamCardModalDetailsComponent,
        CamfilCamCardModalComponent,
        CamfilCounterComponent,
        CamfilErrorComponent,
        CamfilProductAddToBasketModalComponent,
        CamfilProductQuantityComponent,
        CamfilSmallCtaModalComponent,
        CreateOrderModalComponent,
        CreateOrderSuccessComponent,
        FaIconComponent,
        MockComponent(LoadingComponent),
        OrderFormComponent,
      ],
      imports: [NgbModalModule, ReactiveFormsModule, RouterTestingModule, TranslateModule.forRoot()],
      providers: [
        { provide: ShoppingFacade, useFactory: () => instance(shoppingFacadeMock) },
        { provide: CheckoutFacade, useFactory: () => instance(checkoutFacadeMock) },
        { provide: AccountFacade, useFactory: () => instance(accountFacadeMock) },
        { provide: CamCardsFacade, useFactory: () => instance(camCardFacadeMock) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilProductAddToBasketModalComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.product = { name: 'Test Product', sku: 'test sku', minOrderQuantity: 1 } as Product;
    component.quantity = 1;

    when(camCardFacadeMock.camCard$).thenReturn(of([camCardDetails]));
    when(camCardFacadeMock.virtualCamCard$).thenReturn(of(camCardDetails));
    when(checkoutFacadeMock.buckets$).thenReturn(of([]));
    when(checkoutFacadeMock.basket$).thenReturn(of(basketDetails));
    when(shoppingFacadeMock.productAdded$).thenReturn(of(true));
    when(shoppingFacadeMock.productUpdated$).thenReturn(of(false));
    when(shoppingFacadeMock.basketAddresses$).thenReturn(of([]));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
