import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IshCheckoutFacade } from 'camfil-pwa/facades/ish-checkout.facade';
import { MockComponent, MockDirective } from 'ng-mocks';
import { of } from 'rxjs';
import { LazyCamfilCheckoutReceiptRequisitionComponent } from 'src/app/extensions/cam-requisition-management/exports/lazy-camfil-checkout-receipt-requisition/lazy-camfil-checkout-receipt-requisition.component';
import { instance, mock, when } from 'ts-mockito';

import { AuthorizationToggleDirective } from 'ish-core/directives/authorization-toggle.directive';
import { NotAuthorizationToggleDirective } from 'ish-core/directives/not-authorization-toggle.directive';
import { Order } from 'ish-core/models/order/order.model';
import { CamfilLoadingComponent } from 'ish-shared/components/common/camfil-loading/camfil-loading.component';

import { CamfilCheckoutReceiptOrderComponent } from './camfil-checkout-receipt-order/camfil-checkout-receipt-order.component';
import { CamfilCheckoutReceiptPageComponent } from './camfil-checkout-receipt-page.component';
import { CamfilCheckoutReceiptComponent } from './camfil-checkout-receipt/camfil-checkout-receipt.component';

describe('Camfil Checkout Receipt Page Component', () => {
  let component: CamfilCheckoutReceiptPageComponent;
  let fixture: ComponentFixture<CamfilCheckoutReceiptPageComponent>;
  let element: HTMLElement;
  let ishCheckoutFacade: IshCheckoutFacade;

  const selectedOrder: Order = {
    id: '1',
    documentNo: '1',
    creationDate: 1,
    customer: '1',
    orderCreation: {
      status: 'COMPLETED',
    },
    statusCode: 'NEW',
    status: '1',
    totals: {
      total: {
        gross: 141796.98,
        net: 141796.98,
        type: 'PriceItem',
        currency: 'USD',
      },
      discountTotal: {
        gross: 141796.98,
        net: 141796.98,
        type: 'PriceItem',
        currency: 'USD',
      },
      itemTotal: {
        gross: 141796.98,
        net: 141796.98,
        type: 'PriceItem',
        currency: 'USD',
      },
      isEstimated: false,
    },
  };

  beforeEach(async () => {
    ishCheckoutFacade = mock(IshCheckoutFacade);

    await TestBed.configureTestingModule({
      declarations: [
        CamfilCheckoutReceiptPageComponent,
        MockComponent(CamfilCheckoutReceiptComponent),
        MockComponent(CamfilCheckoutReceiptOrderComponent),
        MockComponent(CamfilLoadingComponent),
        MockComponent(LazyCamfilCheckoutReceiptRequisitionComponent),
        MockDirective(AuthorizationToggleDirective),
        MockDirective(NotAuthorizationToggleDirective),
      ],
      providers: [{ provide: IshCheckoutFacade, useFactory: () => instance(ishCheckoutFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilCheckoutReceiptPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    when(ishCheckoutFacade.selectedOrder$).thenReturn(of(selectedOrder));
    when(ishCheckoutFacade.basketLoading$).thenReturn(of(false));
    when(ishCheckoutFacade.submittedBasket$).thenReturn(of(undefined));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
