import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CamfilDeliveryAddressComponent } from 'camfil-pwa/components/camfil-delivery-address/camfil-delivery-address.component';
import { CamfilPwaFacade } from 'camfil-pwa/facades/camfil-pwa.facade';
import { MockComponent, MockPipe } from 'ng-mocks';
import { of } from 'rxjs';
import { anything, instance, mock, when } from 'ts-mockito';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { Price } from 'ish-core/models/price/price.model';
import { PricePipe } from 'ish-core/models/price/price.pipe';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { CamfilSlugifyPipe } from 'ish-core/pipes/camfil-slugify.pipe';
import { DatePipe } from 'ish-core/pipes/date.pipe';
import { OrderLineMockData } from 'ish-core/utils/dev/orderline-mock-data';
import { AddressComponent } from 'ish-shared/components/address/address/address.component';
import { CamfilBasketCostSummaryComponent } from 'ish-shared/components/basket/camfil-basket-cost-summary/camfil-basket-cost-summary.component';
import { CamfilAddressComponent } from 'ish-shared/components/camfil-address/camfil-address.component';
import { CamfilLoadingComponent } from 'ish-shared/components/common/camfil-loading/camfil-loading.component';
import { CamfilSmallCtaModalComponent } from 'ish-shared/components/common/camfil-small-cta-modal/camfil-small-cta-modal.component';
import { InfoBoxComponent } from 'ish-shared/components/common/info-box/info-box.component';
import { CamfilLineItemTableComponent } from 'ish-shared/components/line-item/camfil-line-item-table/camfil-line-item-table.component';

import { CamfilAccountOrderComponent } from './camfil-account-order.component';

describe('Camfil Account Order Component', () => {
  let component: CamfilAccountOrderComponent;
  let fixture: ComponentFixture<CamfilAccountOrderComponent>;
  let element: HTMLElement;
  let shoppingFacadeMock: ShoppingFacade;
  let camfilAccountFacadeMock: CamfilPwaFacade;

  beforeEach(async () => {
    shoppingFacadeMock = mock(ShoppingFacade);
    camfilAccountFacadeMock = mock(CamfilPwaFacade);
    await TestBed.configureTestingModule({
      declarations: [
        CamfilAccountOrderComponent,
        CamfilDeliveryAddressComponent,
        MockComponent(AddressComponent),
        MockComponent(CamfilAddressComponent),
        MockComponent(CamfilBasketCostSummaryComponent),
        MockComponent(CamfilLineItemTableComponent),
        MockComponent(CamfilLoadingComponent),
        MockComponent(CamfilSmallCtaModalComponent),
        MockComponent(FaIconComponent),
        MockComponent(InfoBoxComponent),
        MockPipe(CamfilSlugifyPipe),
        MockPipe(DatePipe),
        MockPipe(PricePipe, (price: Price) => `${price.currency} ${price.value}`),
      ],
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      providers: [
        { provide: CamfilPwaFacade, useFactory: () => instance(camfilAccountFacadeMock) },
        { provide: ShoppingFacade, useFactory: () => instance(shoppingFacadeMock) },
        provideMockStore({}),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilAccountOrderComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.order = OrderLineMockData.getOrder();
    when(shoppingFacadeMock.product$(anything(), anything())).thenReturn(of({ sku: '4713' } as ProductView));
    when(camfilAccountFacadeMock.orderLineItems$(anything())).thenReturn(of([]));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should be rendered without errors if no order is available', () => {
    component.order = undefined;
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render order details for the given order', () => {
    fixture.detectChanges();

    expect(element.querySelector('[data-testing-id=order-summary-info]')).toBeTruthy();
  });
});
