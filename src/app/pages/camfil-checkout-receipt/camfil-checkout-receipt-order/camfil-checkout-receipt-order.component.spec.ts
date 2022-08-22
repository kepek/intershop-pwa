import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';
import { ContentIncludeComponent } from 'ish-shared/cms/components/content-include/content-include.component';
import { ModalDialogLinkComponent } from 'ish-shared/components/common/modal-dialog-link/modal-dialog-link.component';

import { CamfilCheckoutReceiptOrderComponent } from './camfil-checkout-receipt-order.component';

describe('Camfil Checkout Receipt Order Component', () => {
  let component: CamfilCheckoutReceiptOrderComponent;
  let fixture: ComponentFixture<CamfilCheckoutReceiptOrderComponent>;
  let element: HTMLElement;
  let accountFacadeMock: AccountFacade;
  let checkoutFacade: CheckoutFacade;

  beforeEach(async () => {
    accountFacadeMock = mock(AccountFacade);
    checkoutFacade = mock(CheckoutFacade);
    await TestBed.configureTestingModule({
      declarations: [
        CamfilCheckoutReceiptOrderComponent,
        MockComponent(ContentIncludeComponent),
        MockComponent(ModalDialogLinkComponent),
      ],
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      providers: [
        { provide: AccountFacade, useFactory: () => instance(accountFacadeMock) },
        { provide: CheckoutFacade, useFactory: () => instance(checkoutFacade) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilCheckoutReceiptOrderComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.order = BasketMockData.getOrder();
    when(accountFacadeMock.isLoggedIn$).thenReturn(of(false));
    when(checkoutFacade.isFreightCostInvalid$).thenReturn(of(false));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display the document number after creation', () => {
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id="order-document-number"]').innerHTML.trim()).toContain('12345678');
  });
});
