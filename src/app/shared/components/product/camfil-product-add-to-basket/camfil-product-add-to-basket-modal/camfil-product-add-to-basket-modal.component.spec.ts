import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { instance, mock } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { CamfilCamCardModalComponent } from 'ish-shared/components/common/camfil-cam-card-modal/camfil-cam-card-modal.component';
import { CamfilErrorComponent } from 'ish-shared/components/common/camfil-error/camfil-error.component';
import { CamfilProductQuantityComponent } from 'ish-shared/components/product/camfil-product-quantity/camfil-product-quantity.component';
import { CamfilCounterComponent } from 'ish-shared/forms/components/camfil-counter/camfil-counter.component';

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
  let checkoutFacadeMock: CheckoutFacade;
  let accountFacadeMock: AccountFacade;

  beforeEach(async () => {
    checkoutFacadeMock = mock(CheckoutFacade);
    accountFacadeMock = mock(AccountFacade);

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
        CreateOrderModalComponent,
        CreateOrderSuccessComponent,
        OrderFormComponent,
      ],
      imports: [NgbModalModule, ReactiveFormsModule, RouterTestingModule, TranslateModule.forRoot()],
      providers: [
        { provide: CheckoutFacade, useFactory: () => instance(checkoutFacadeMock) },
        { provide: AccountFacade, useFactory: () => instance(accountFacadeMock) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilProductAddToBasketModalComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
