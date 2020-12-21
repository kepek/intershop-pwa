import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent, MockPipe } from 'ng-mocks';

import { PricePipe } from 'ish-core/models/price/price.pipe';
import { DatePipe } from 'ish-core/pipes/date.pipe';
import { ProductRoutePipe } from 'ish-core/routing/product/product-route.pipe';
import { AddressComponent } from 'ish-shared/components/address/address/address.component';
import { CamfilBasketCostSummaryComponent } from 'ish-shared/components/basket/camfil-basket-cost-summary/camfil-basket-cost-summary.component';
import { CamfilProductAddToBasketComponent } from 'ish-shared/components/product/camfil-product-add-to-basket/camfil-product-add-to-basket.component';

import { CamfilCheckoutLineItemComponent } from '../camfil-checkout-line-item/camfil-checkout-line-item.component';

import { CamfilCheckoutListComponent } from './camfil-checkout-list.component';

describe('Camfil Checkout List Component', () => {
  let component: CamfilCheckoutListComponent;
  let fixture: ComponentFixture<CamfilCheckoutListComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CamfilCheckoutListComponent,
        MockComponent(AddressComponent),
        MockComponent(CamfilBasketCostSummaryComponent),
        MockComponent(CamfilCheckoutLineItemComponent),
        MockComponent(CamfilProductAddToBasketComponent),
        MockPipe(DatePipe),
        MockPipe(PricePipe),
        MockPipe(ProductRoutePipe),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilCheckoutListComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.order = {
      customer: {},
      contacts: [
        {
          firstName: 'test',
          lastName: 'test',
        },
      ],
    };
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
