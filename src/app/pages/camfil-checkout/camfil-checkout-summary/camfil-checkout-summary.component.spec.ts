import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent, MockPipe } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { Basket } from 'ish-core/models/basket/basket.model';
import { PricePipe } from 'ish-core/models/price/price.pipe';
import { ContentIncludeComponent } from 'ish-shared/cms/components/content-include/content-include.component';

import { CamfilCheckoutSummaryComponent } from './camfil-checkout-summary.component';

describe('Camfil Checkout Summary Component', () => {
  let component: CamfilCheckoutSummaryComponent;
  let fixture: ComponentFixture<CamfilCheckoutSummaryComponent>;
  let element: HTMLElement;
  let basket: Basket;
  let checkoutFacade: CheckoutFacade;

  beforeEach(async () => {
    checkoutFacade = mock(CheckoutFacade);

    await TestBed.configureTestingModule({
      declarations: [CamfilCheckoutSummaryComponent, MockComponent(ContentIncludeComponent), MockPipe(PricePipe)],
      imports: [RouterTestingModule],
      providers: [{ provide: CheckoutFacade, useFactory: () => instance(checkoutFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilCheckoutSummaryComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    basket = { totals: {} } as Basket;
    basket.totals.total = { type: 'PriceItem', currency: 'USD', gross: 0.0, net: 0.0 };
    basket.totals.taxTotal = { type: 'Money', currency: 'USD', value: 0.0 };
    component.basket = basket;

    when(checkoutFacade.basketValidationResults$).thenReturn(
      of({
        valid: false,
        adjusted: false,
      })
    );
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
