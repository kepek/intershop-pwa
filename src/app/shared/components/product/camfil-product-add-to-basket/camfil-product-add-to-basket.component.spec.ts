import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CamfilChannelToggleDirective } from 'camfil-pwa/directives/camfil-channel-toggle.directive';
import { CamfilConfigurationFacade } from 'camfil-pwa/facades/camfil-configuration.facade';
import { MockComponent, MockDirective, MockPipe } from 'ng-mocks';
import { ToastrModule } from 'ngx-toastr';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { CamfilMaxLengthAttributeCreateDirective } from 'ish-core/directives/camfil-max-length-attribute-create.directive';
import { AccountFacade } from 'ish-core/facades/account.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { Product } from 'ish-core/models/product/product.model';
import { AddressSortPipe } from 'ish-core/pipes/camfil-address-sort.pipe';
import { CamfilContactSortPipe } from 'ish-core/pipes/camfil-contact-sort.pipe';
import { CamfilCamCardModalComponent } from 'ish-shared/components/common/camfil-cam-card-modal/camfil-cam-card-modal.component';
import { CamfilCityFieldComponent } from 'ish-shared/components/common/camfil-city-field/camfil-city-field.component';
import { CamfilErrorComponent } from 'ish-shared/components/common/camfil-error/camfil-error.component';
import { CamfilLoadingComponent } from 'ish-shared/components/common/camfil-loading/camfil-loading.component';
import { CamfilSmallCtaModalComponent } from 'ish-shared/components/common/camfil-small-cta-modal/camfil-small-cta-modal.component';
import { CamfilProductAddToBasketModalComponent } from 'ish-shared/components/product/camfil-product-add-to-basket/camfil-product-add-to-basket-modal/camfil-product-add-to-basket-modal.component';
import { CamfilProductQuantityComponent } from 'ish-shared/components/product/camfil-product-quantity/camfil-product-quantity.component';
import { ProductAddToBasketComponent } from 'ish-shared/components/product/product-add-to-basket/product-add-to-basket.component';
import { ZipCodeComponent } from 'ish-shared/components/zip-code/zip-code.component';
import { CamfilCounterComponent } from 'ish-shared/forms/components/camfil-counter/camfil-counter.component';

import { ArticleDetailsComponent } from '../../../../extensions/cam-cards/shared/add-product-to-cam-card-modal/article-details/article-details.component';
import { AddProductToCartModalComponent } from '../../../../extensions/cam-cards/shared/add-product-to-cart-modal/add-product-to-cart-modal.component';
import { CamCardModalDetailsComponent } from '../../../../extensions/cam-cards/shared/add-product-to-cart-modal/cam-card-modal-details/cam-card-modal-details.component';
import { CreateOrderProductModalComponent } from '../../../../extensions/cam-cards/shared/add-product-to-cart-modal/create-order-product-modal/create-order-product-modal.component';
import { OrderFormComponent } from '../../../../extensions/cam-cards/shared/add-product-to-cart-modal/create-order-product-modal/order-form/order-form.component';
import { CreateOrderProductSuccessComponent } from '../../../../extensions/cam-cards/shared/add-product-to-cart-modal/create-order-product-success/create-order-product-success.component';

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
    const camfilConfigurationFacadeMock = mock(CamfilConfigurationFacade);

    when(checkoutFacade.basketLoading$).thenReturn(of(false));
    when(accountFacadeMock.isLoggedIn$).thenReturn(of(false));
    when(camfilConfigurationFacadeMock.isEnabled$('hideAddToBasketLightboxForNonLoggedInUser')).thenReturn(of(false));

    await TestBed.configureTestingModule({
      imports: [FeatureToggleModule.forTesting(), ToastrModule.forRoot(), TranslateModule.forRoot()],
      declarations: [
        AddProductToCartModalComponent,
        ArticleDetailsComponent,
        CamCardModalDetailsComponent,
        CamfilCamCardModalComponent,
        CamfilContactSortPipe,
        CamfilCounterComponent,
        CamfilErrorComponent,
        CamfilMaxLengthAttributeCreateDirective,
        CamfilProductAddToBasketComponent,
        CamfilProductAddToBasketModalComponent,
        CamfilProductQuantityComponent,
        CreateOrderProductModalComponent,
        CreateOrderProductSuccessComponent,
        MockComponent(CamfilCityFieldComponent),
        MockComponent(CamfilLoadingComponent),
        MockComponent(CamfilSmallCtaModalComponent),
        MockComponent(FaIconComponent),
        MockComponent(ZipCodeComponent),
        MockDirective(CamfilChannelToggleDirective),
        MockPipe(AddressSortPipe),
        MockPipe(CamfilContactSortPipe),
        OrderFormComponent,
        ProductAddToBasketComponent,
      ],
      providers: [
        { provide: CheckoutFacade, useFactory: () => instance(checkoutFacade) },
        { provide: AccountFacade, useFactory: () => instance(accountFacadeMock) },
        { provide: CamfilConfigurationFacade, useFactory: () => instance(camfilConfigurationFacadeMock) },
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
