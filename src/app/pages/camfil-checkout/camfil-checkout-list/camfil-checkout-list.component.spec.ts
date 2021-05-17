import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { MockComponent, MockDirective, MockPipe } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { PricePipe } from 'ish-core/models/price/price.pipe';
import { AddressSortPipe } from 'ish-core/pipes/camfil-address-sort.pipe';
import { DatePipe } from 'ish-core/pipes/date.pipe';
import { HighlightPipe } from 'ish-core/pipes/highlight.pipe';
import { ProductRoutePipe } from 'ish-core/routing/product/product-route.pipe';
import { ContentIncludeComponent } from 'ish-shared/cms/components/content-include/content-include.component';
import { AddressComponent } from 'ish-shared/components/address/address/address.component';
import { CamfilBasketCostSummaryComponent } from 'ish-shared/components/basket/camfil-basket-cost-summary/camfil-basket-cost-summary.component';
import { CamfilCamCardModalComponent } from 'ish-shared/components/common/camfil-cam-card-modal/camfil-cam-card-modal.component';
import { CamfilErrorComponent } from 'ish-shared/components/common/camfil-error/camfil-error.component';
import { CamfilSmallCtaModalComponent } from 'ish-shared/components/common/camfil-small-cta-modal/camfil-small-cta-modal.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';
import { CamfilProductAddToBasketComponent } from 'ish-shared/components/product/camfil-product-add-to-basket/camfil-product-add-to-basket.component';
import { CamfilProductQuantityComponent } from 'ish-shared/components/product/camfil-product-quantity/camfil-product-quantity.component';
import { ZipCodeComponent } from 'ish-shared/components/zip-code/zip-code.component';
import { CamfilCounterComponent } from 'ish-shared/forms/components/camfil-counter/camfil-counter.component';
import { CamfilSearchBoxComponent } from 'ish-shell/header/header/camfil-search-box/camfil-search-box.component';

import { CamCardsFacade } from '../../../extensions/cam-cards/facades/cam-cards.facade';
import { ModalAddNewProductComponent } from '../../../extensions/cam-cards/pages/account-cam-card-detail/modal-add-new-product/modal-add-new-product.component';
import { OrderFormComponent } from '../../../extensions/cam-cards/shared/add-to-cart-modal/create-order-modal/order-form/order-form.component';
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

  beforeEach(async () => {
    camCardFacadeMock = mock(CamCardsFacade);
    shoppingFacadeMock = mock(ShoppingFacade);
    checkoutFacadeMock = mock(CheckoutFacade);

    await TestBed.configureTestingModule({
      declarations: [
        CamfilCamCardModalComponent,
        CamfilCheckoutDeliveryAddressComponent,
        CamfilCheckoutListComponent,
        CamfilCounterComponent,
        CamfilDeleteOrderComponent,
        CamfilProductQuantityComponent,
        CamfilSmallCtaModalComponent,
        EditOrderModalComponent,
        MockComponent(AddEmailRecipientModalComponent),
        MockComponent(AddressComponent),
        MockComponent(CamfilBasketCostSummaryComponent),
        MockComponent(CamfilCheckoutLineItemComponent),
        MockComponent(CamfilErrorComponent),
        MockComponent(CamfilProductAddToBasketComponent),
        MockComponent(CamfilSearchBoxComponent),
        MockComponent(ContentIncludeComponent),
        MockComponent(FaIconComponent),
        MockComponent(LoadingComponent),
        MockComponent(ZipCodeComponent),
        MockDirective(ServerHtmlDirective),
        MockPipe(AddressSortPipe),
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
      totals: 999,
    };

    component.basket = {
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
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
