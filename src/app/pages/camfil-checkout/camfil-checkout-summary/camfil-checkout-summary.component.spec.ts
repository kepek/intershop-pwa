import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockPipe } from 'ng-mocks';

import { Basket } from 'ish-core/models/basket/basket.model';
import { PricePipe } from 'ish-core/models/price/price.pipe';

import { CamfilCheckoutSummaryComponent } from './camfil-checkout-summary.component';

describe('Camfil Checkout Summary Component', () => {
  let component: CamfilCheckoutSummaryComponent;
  let fixture: ComponentFixture<CamfilCheckoutSummaryComponent>;
  let element: HTMLElement;
  let basket: Basket;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CamfilCheckoutSummaryComponent, MockPipe(PricePipe)],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilCheckoutSummaryComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    basket = { totals: {} } as Basket;
    basket.totals.total = { type: 'PriceItem', currency: 'USD', gross: 0.0, net: 0.0 };
    basket.totals.taxTotal = { type: 'PriceItem', currency: 'USD', gross: 0.0, net: 0.0 };

    component.basket = basket;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
