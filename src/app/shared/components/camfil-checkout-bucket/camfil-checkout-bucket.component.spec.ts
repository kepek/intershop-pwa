import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { MockComponent, MockDirective, MockPipe } from 'ng-mocks';
import { of } from 'rxjs';
import { CamConfigurationFacade } from 'src/app/extensions/cam-configuration/facades/cam-configuration.facade';
import { ConfigurationService } from 'src/app/extensions/cam-configuration/services/configuration/configuration.service';
import { CamRequisitionManagementFacade } from 'src/app/extensions/cam-requisition-management/facades/cam-requisition-management.facade';
import { instance, mock, when } from 'ts-mockito';

import { CamfilMaxLengthAttributeCreateDirective } from 'ish-core/directives/camfil-max-length-attribute-create.directive';
import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { AccountFacade } from 'ish-core/facades/account.facade';
import { AppFacade } from 'ish-core/facades/app.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { BasketTotal } from 'ish-core/models/basket-total/basket-total.model';
import { PricePipe } from 'ish-core/models/price/price.pipe';
import { AddressSortPipe } from 'ish-core/pipes/camfil-address-sort.pipe';
import { CamfilContactSortPipe } from 'ish-core/pipes/camfil-contact-sort.pipe';
import { CamfilSlugifyPipe } from 'ish-core/pipes/camfil-slugify.pipe';
import { DatePipe } from 'ish-core/pipes/date.pipe';
import { HighlightPipe } from 'ish-core/pipes/highlight.pipe';
import { ProductRoutePipe } from 'ish-core/routing/product/product-route.pipe';
import { ContentIncludeComponent } from 'ish-shared/cms/components/content-include/content-include.component';
import { AddressComponent } from 'ish-shared/components/address/address/address.component';
import { CamfilBasketCostSummaryComponent } from 'ish-shared/components/basket/camfil-basket-cost-summary/camfil-basket-cost-summary.component';
import { CamfilBucketValidationResultsComponent } from 'ish-shared/components/basket/camfil-bucket-validation-results/camfil-bucket-validation-results.component';
import { CamfilAddressComponent } from 'ish-shared/components/camfil-address/camfil-address.component';
import { CamfilCheckoutBucketSummaryComponent } from 'ish-shared/components/camfil-checkout-bucket-summary/camfil-checkout-bucket-summary.component';
import { CamfilCheckoutLineItemComponent } from 'ish-shared/components/camfil-checkout-line-item/camfil-checkout-line-item.component';
import { CamfilCamCardModalComponent } from 'ish-shared/components/common/camfil-cam-card-modal/camfil-cam-card-modal.component';
import { CamfilCityFieldComponent } from 'ish-shared/components/common/camfil-city-field/camfil-city-field.component';
import { CamfilErrorComponent } from 'ish-shared/components/common/camfil-error/camfil-error.component';
import { CamfilLoadingComponent } from 'ish-shared/components/common/camfil-loading/camfil-loading.component';
import { CamfilSmallCtaModalComponent } from 'ish-shared/components/common/camfil-small-cta-modal/camfil-small-cta-modal.component';
import { CamfilProductAddToBasketComponent } from 'ish-shared/components/product/camfil-product-add-to-basket/camfil-product-add-to-basket.component';
import { CamfilProductQuantityComponent } from 'ish-shared/components/product/camfil-product-quantity/camfil-product-quantity.component';
import { ZipCodeComponent } from 'ish-shared/components/zip-code/zip-code.component';
import { CamfilCounterComponent } from 'ish-shared/forms/components/camfil-counter/camfil-counter.component';
import { CamfilSearchBoxComponent } from 'ish-shell/header/header/camfil-search-box/camfil-search-box.component';

import { CamCardsFacade } from '../../../extensions/cam-cards/facades/cam-cards.facade';
import { ModalAddNewProductComponent } from '../../../extensions/cam-cards/pages/account-cam-card-detail/modal-add-new-product/modal-add-new-product.component';
import { ArticleDetailsComponent } from '../../../extensions/cam-cards/shared/add-product-to-cam-card-modal/article-details/article-details.component';
import { OrderFormComponent } from '../../../extensions/cam-cards/shared/add-product-to-cart-modal/create-order-product-modal/order-form/order-form.component';
import { CamfilCheckoutGuestFormComponent } from '../../../pages/camfil-checkout-onestep/camfil-checkout-guest-form/camfil-checkout-guest-form.component';

import { CamfilCheckoutBucketComponent } from './camfil-checkout-bucket.component';
import { CamfilDeleteOrderComponent } from './camfil-delete-order/camfil-delete-order.component';
import { CamfilEditOrderModalComponent } from './camfil-edit-order-modal/camfil-edit-order-modal.component';

describe('Camfil Checkout Bucket Component', () => {
  let component: CamfilCheckoutBucketComponent;
  let fixture: ComponentFixture<CamfilCheckoutBucketComponent>;
  let element: HTMLElement;
  let camCardFacadeMock: CamCardsFacade;
  let shoppingFacadeMock: ShoppingFacade;
  let checkoutFacadeMock: CheckoutFacade;
  let appFacadeMock: AppFacade;
  let camConfigurationFacadeMock: CamConfigurationFacade;
  let accountFacadeMock: AccountFacade;
  let reqFacade: CamRequisitionManagementFacade;
  let configurationServiceMock: ConfigurationService;

  beforeEach(async () => {
    appFacadeMock = mock(AppFacade);
    camCardFacadeMock = mock(CamCardsFacade);
    shoppingFacadeMock = mock(ShoppingFacade);
    checkoutFacadeMock = mock(CheckoutFacade);
    camConfigurationFacadeMock = mock(CamConfigurationFacade);
    accountFacadeMock = mock(AccountFacade);
    reqFacade = mock(CamRequisitionManagementFacade);
    configurationServiceMock = mock(ConfigurationService);

    await TestBed.configureTestingModule({
      declarations: [
        ArticleDetailsComponent,
        CamfilAddressComponent,
        CamfilCamCardModalComponent,
        CamfilCheckoutBucketComponent,
        CamfilCheckoutGuestFormComponent,
        CamfilContactSortPipe,
        CamfilCounterComponent,
        CamfilDeleteOrderComponent,
        CamfilEditOrderModalComponent,
        CamfilMaxLengthAttributeCreateDirective,
        CamfilProductQuantityComponent,
        CamfilSmallCtaModalComponent,
        MockComponent(AddressComponent),
        MockComponent(CamfilBasketCostSummaryComponent),
        MockComponent(CamfilBucketValidationResultsComponent),
        MockComponent(CamfilCheckoutBucketSummaryComponent),
        MockComponent(CamfilCheckoutLineItemComponent),
        MockComponent(CamfilCityFieldComponent),
        MockComponent(CamfilErrorComponent),
        MockComponent(CamfilLoadingComponent),
        MockComponent(CamfilProductAddToBasketComponent),
        MockComponent(CamfilSearchBoxComponent),
        MockComponent(ContentIncludeComponent),
        MockComponent(FaIconComponent),
        MockComponent(ZipCodeComponent),
        MockDirective(ServerHtmlDirective),
        MockPipe(AddressSortPipe),
        MockPipe(CamfilContactSortPipe),
        MockPipe(CamfilSlugifyPipe),
        MockPipe(DatePipe),
        MockPipe(HighlightPipe),
        MockPipe(PricePipe),
        MockPipe(ProductRoutePipe),
        ModalAddNewProductComponent,
        OrderFormComponent,
      ],
      providers: [
        { provide: CamCardsFacade, useFactory: () => instance(camCardFacadeMock) },
        { provide: ShoppingFacade, useFactory: () => instance(shoppingFacadeMock) },
        { provide: CheckoutFacade, useFactory: () => instance(checkoutFacadeMock) },
        { provide: CamConfigurationFacade, useFactory: () => instance(camConfigurationFacadeMock) },
        { provide: AppFacade, useFactory: () => instance(appFacadeMock) },
        { provide: AccountFacade, useFactory: () => instance(accountFacadeMock) },
        { provide: CamRequisitionManagementFacade, useFactory: () => instance(reqFacade) },
        { provide: ConfigurationService, useFactory: () => instance(configurationServiceMock) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilCheckoutBucketComponent);
    component = fixture.componentInstance;

    component.bucket = {
      basket: 'test_basketId',
      id: 'test_id',
      customer: {
        id: 'test_customerId',
        customerNo: 'test_customerNo',
      },
      contacts: [
        {
          firstName: 'test',
          lastName: 'test',
        },
      ],
      lineItems: [],
      totals: undefined,
    };

    component.basket = {
      id: 'test_customerId2',
      totals: {
        total: { gross: 2000, net: 1800, currency: 'USD' },
      } as BasketTotal,
      basketExtensions: [
        {
          emailRecipients: ['test@test.se'],
        },
      ],
    };

    element = fixture.nativeElement;

    when(shoppingFacadeMock.basketAddresses$).thenReturn(of([]));
    when(checkoutFacadeMock.calendarExceptions$).thenReturn(of([]));
    when(shoppingFacadeMock.productUpdated$).thenReturn(of(false));
    when(shoppingFacadeMock.productAdded$).thenReturn(of(false));
    when(checkoutFacadeMock.getCustomersDeliveryTerms$).thenReturn(of({}));
    when(checkoutFacadeMock.basketInvoiceAddress$).thenReturn(of({}));
    when(checkoutFacadeMock.getFocusedCheckoutElement$).thenReturn(of({}));
    when(accountFacadeMock.isLoggedIn$).thenReturn(of(false));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
