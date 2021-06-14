import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { BasketView } from 'ish-core/models/basket/basket.model';
import { Product } from 'ish-core/models/product/product.model';
import { CamfilCamCardModalComponent } from 'ish-shared/components/common/camfil-cam-card-modal/camfil-cam-card-modal.component';
import { CamfilErrorComponent } from 'ish-shared/components/common/camfil-error/camfil-error.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';
import { CamfilProductQuantityComponent } from 'ish-shared/components/product/camfil-product-quantity/camfil-product-quantity.component';
import { ZipCodeComponent } from 'ish-shared/components/zip-code/zip-code.component';
import { CamfilCounterComponent } from 'ish-shared/forms/components/camfil-counter/camfil-counter.component';

import { CamCardsFacade } from '../../facades/cam-cards.facade';
import { ArticleDetailsComponent } from '../add-product-to-cam-card-modal/article-details/article-details.component';

import { AddProductToCartModalComponent } from './add-product-to-cart-modal.component';
import { CamCardModalDetailsComponent } from './cam-card-modal-details/cam-card-modal-details.component';
import { CreateOrderProductModalComponent } from './create-order-product-modal/create-order-product-modal.component';
import { OrderFormComponent } from './create-order-product-modal/order-form/order-form.component';
import { CreateOrderProductSuccessComponent } from './create-order-product-success/create-order-product-success.component';

describe('Add Product To Cart Modal Component', () => {
  let component: AddProductToCartModalComponent;
  let fixture: ComponentFixture<AddProductToCartModalComponent>;
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
        AddProductToCartModalComponent,
        ArticleDetailsComponent,
        CamCardModalDetailsComponent,
        CamfilCamCardModalComponent,
        CamfilCounterComponent,
        CamfilErrorComponent,
        MockComponent(CamfilProductQuantityComponent),
        MockComponent(CreateOrderProductModalComponent),
        MockComponent(CreateOrderProductSuccessComponent),
        MockComponent(LoadingComponent),
        MockComponent(OrderFormComponent),
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
    fixture = TestBed.createComponent(AddProductToCartModalComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.product = { name: 'Test Product', sku: 'test sku', minOrderQuantity: 1 } as Product;

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
