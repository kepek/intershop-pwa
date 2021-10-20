import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent, MockDirective, MockPipe } from 'ng-mocks';
import { of } from 'rxjs';
import { ChannelToggleDirective } from 'src/app/extensions/cam-configuration/directives/channel-toggle.directive';
import { instance, mock, when } from 'ts-mockito';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
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
  let shoppingFacade: ShoppingFacade;

  beforeEach(async () => {
    checkoutFacade = mock(CheckoutFacade);
    shoppingFacade = mock(ShoppingFacade);

    await TestBed.configureTestingModule({
      declarations: [
        CamfilCheckoutSummaryComponent,
        MockComponent(ContentIncludeComponent),
        MockDirective(ChannelToggleDirective),
        MockPipe(PricePipe),
      ],
      imports: [RouterTestingModule],
      providers: [
        { provide: CheckoutFacade, useFactory: () => instance(checkoutFacade) },
        { provide: ShoppingFacade, useFactory: () => instance(shoppingFacade) },
      ],
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
    when(shoppingFacade.productsReadyToPlaceOrder$).thenReturn(of(true));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
