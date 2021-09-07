import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { MockComponent, MockDirective, MockPipe } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { CamfilMaxLengthAttributeCreateDirective } from 'ish-core/directives/camfil-max-length-attribute-create.directive';
import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { AppFacade } from 'ish-core/facades/app.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { BasketTotal } from 'ish-core/models/basket-total/basket-total.model';
import { PricePipe } from 'ish-core/models/price/price.pipe';
import { AddressSortPipe } from 'ish-core/pipes/camfil-address-sort.pipe';
import { CamfilContactSortPipe } from 'ish-core/pipes/camfil-contact-sort.pipe';
import { DatePipe } from 'ish-core/pipes/date.pipe';
import { HighlightPipe } from 'ish-core/pipes/highlight.pipe';
import { ProductRoutePipe } from 'ish-core/routing/product/product-route.pipe';
import { ContentIncludeComponent } from 'ish-shared/cms/components/content-include/content-include.component';
import { AddressComponent } from 'ish-shared/components/address/address/address.component';
import { CamfilBasketCostSummaryComponent } from 'ish-shared/components/basket/camfil-basket-cost-summary/camfil-basket-cost-summary.component';
import { CamfilCamCardModalComponent } from 'ish-shared/components/common/camfil-cam-card-modal/camfil-cam-card-modal.component';
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
import { AddEmailRecipientModalComponent } from '../add-email-recipient-modal/add-email-recipient-modal.component';
import { CamfilCheckoutLineItemComponent } from '../camfil-checkout-line-item/camfil-checkout-line-item.component';

import { CamfilCheckoutDeliveryAddressComponent } from './camfil-checkout-delivery-address/camfil-checkout-delivery-address.component';
import { CamfilCheckoutListComponent } from './camfil-checkout-list.component';
import { CamfilDeleteOrderComponent } from './camfil-delete-order/camfil-delete-order.component';
import { EditOrderModalComponent } from './edit-order-modal/edit-order-modal.component';

describe('Camfil Checkout List Component', () => {
  let component: CamfilCheckoutListComponent;
  let fixture: ComponentFixture<CamfilCheckoutListComponent>;
  let element: HTMLElement;
  let camCardFacadeMock: CamCardsFacade;
  let shoppingFacadeMock: ShoppingFacade;
  let checkoutFacadeMock: CheckoutFacade;
  let appFacadeMock: AppFacade;

  beforeEach(async () => {
    appFacadeMock = mock(AppFacade);
    camCardFacadeMock = mock(CamCardsFacade);
    shoppingFacadeMock = mock(ShoppingFacade);
    checkoutFacadeMock = mock(CheckoutFacade);

    await TestBed.configureTestingModule({
      declarations: [
        ArticleDetailsComponent,
        CamfilCamCardModalComponent,
        CamfilCheckoutDeliveryAddressComponent,
        CamfilCheckoutListComponent,
        CamfilContactSortPipe,
        CamfilCounterComponent,
        CamfilDeleteOrderComponent,
        CamfilMaxLengthAttributeCreateDirective,
        CamfilProductQuantityComponent,
        CamfilSmallCtaModalComponent,
        EditOrderModalComponent,
        MockComponent(AddEmailRecipientModalComponent),
        MockComponent(AddressComponent),
        MockComponent(CamfilBasketCostSummaryComponent),
        MockComponent(CamfilCheckoutLineItemComponent),
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
        { provide: AppFacade, useFactory: () => instance(appFacadeMock) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilCheckoutListComponent);
    component = fixture.componentInstance;

    component.order = {
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
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
