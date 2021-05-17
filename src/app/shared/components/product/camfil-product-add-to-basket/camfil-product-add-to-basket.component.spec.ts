import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MockComponent, MockPipe } from 'ng-mocks';
import { ToastrModule } from 'ngx-toastr';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { Product } from 'ish-core/models/product/product.model';
import { AddressSortPipe } from 'ish-core/pipes/camfil-address-sort.pipe';
import { CamfilCamCardModalComponent } from 'ish-shared/components/common/camfil-cam-card-modal/camfil-cam-card-modal.component';
import { CamfilErrorComponent } from 'ish-shared/components/common/camfil-error/camfil-error.component';
import { CamfilSmallCtaModalComponent } from 'ish-shared/components/common/camfil-small-cta-modal/camfil-small-cta-modal.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';
import { CamfilProductAddToBasketModalComponent } from 'ish-shared/components/product/camfil-product-add-to-basket/camfil-product-add-to-basket-modal/camfil-product-add-to-basket-modal.component';
import { CamfilProductQuantityComponent } from 'ish-shared/components/product/camfil-product-quantity/camfil-product-quantity.component';
import { ProductAddToBasketComponent } from 'ish-shared/components/product/product-add-to-basket/product-add-to-basket.component';
import { ZipCodeComponent } from 'ish-shared/components/zip-code/zip-code.component';
import { CamfilCounterComponent } from 'ish-shared/forms/components/camfil-counter/camfil-counter.component';

import { AddToCartModalComponent } from '../../../../extensions/cam-cards/shared/add-to-cart-modal/add-to-cart-modal.component';
import { CamCardModalDetailsComponent } from '../../../../extensions/cam-cards/shared/add-to-cart-modal/cam-card-modal-details/cam-card-modal-details.component';
import { CreateOrderModalComponent } from '../../../../extensions/cam-cards/shared/add-to-cart-modal/create-order-modal/create-order-modal.component';
import { OrderFormComponent } from '../../../../extensions/cam-cards/shared/add-to-cart-modal/create-order-modal/order-form/order-form.component';
import { CreateOrderSuccessComponent } from '../../../../extensions/cam-cards/shared/add-to-cart-modal/create-order-success/create-order-success.component';
import { ArticleDetailsComponent } from '../../../../extensions/cam-cards/shared/select-cam-card-modal/article-details/article-details.component';

import { CamfilProductAddToBasketComponent } from './camfil-product-add-to-basket.component';

describe('Camfil Product Add To Basket Component', () => {
  let component: CamfilProductAddToBasketComponent;
  let fixture: ComponentFixture<CamfilProductAddToBasketComponent>;
  let product: Product;
  let translate: TranslateService;
  let element: HTMLElement;

  beforeEach(async () => {
    const checkoutFacade = mock(CheckoutFacade);
    const accountFacadeMock = mock(AccountFacade);
    when(checkoutFacade.basketLoading$).thenReturn(of(false));
    when(accountFacadeMock.isLoggedIn$).thenReturn(of(false));

    await TestBed.configureTestingModule({
      imports: [FeatureToggleModule.forTesting(), ToastrModule.forRoot(), TranslateModule.forRoot()],
      declarations: [
        AddToCartModalComponent,
        ArticleDetailsComponent,
        CamCardModalDetailsComponent,
        CamfilCamCardModalComponent,
        CamfilCounterComponent,
        CamfilErrorComponent,
        CamfilProductAddToBasketComponent,
        CamfilProductAddToBasketModalComponent,
        CamfilProductQuantityComponent,
        CamfilSmallCtaModalComponent,
        CreateOrderModalComponent,
        CreateOrderSuccessComponent,
        MockComponent(FaIconComponent),
        MockComponent(LoadingComponent),
        MockComponent(ZipCodeComponent),
        MockPipe(AddressSortPipe),
        OrderFormComponent,
        ProductAddToBasketComponent,
      ],
      providers: [
        { provide: CheckoutFacade, useFactory: () => instance(checkoutFacade) },
        { provide: AccountFacade, useFactory: () => instance(accountFacadeMock) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilProductAddToBasketComponent);
    component = fixture.componentInstance;
    translate = TestBed.inject(TranslateService);
    translate.setDefaultLang('en');
    translate.use('en');
    product = { sku: 'sku' } as Product;
    product.inStock = true;
    product.minOrderQuantity = 1;
    product.availability = true;
    element = fixture.nativeElement;
    component.product = product;
    component.buttonTranslationKey = 'product.add_to_cart.link';
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should throw an error if input parameter product is not set', () => {
    component.product = undefined;
    fixture.detectChanges();
    expect(element.querySelector('button')).toBeFalsy();
  });

  it('should not render when inStock = false', () => {
    product.inStock = false;

    fixture.detectChanges();
    expect(element.querySelector('button')).toBeFalsy();
  });

  it('should show button when display type is not icon ', () => {
    fixture.detectChanges();
    expect(element.querySelector('button').className).toContain('btn-primary');
  });

  it('should show disable button when "disabled" is set to "false" ', () => {
    component.disabled = true;
    fixture.detectChanges();
    expect(element.querySelector('button').disabled).toBeTruthy();
  });

  it('should use default translation when nothing is configured', () => {
    fixture.detectChanges();
    expect(element.textContent).toMatchInlineSnapshot(`"product.add_to_cart.link"`);
  });

  it('should use configured translation when it is configured', () => {
    component.translationKey = 'abc';
    fixture.detectChanges();
    expect(element.textContent).toMatchInlineSnapshot(`"product.add_to_cart.link"`);
  });
});
