import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';

import { CamfilCheckoutDeliveryAddressComponent } from './camfil-checkout-delivery-address.component';

describe('Camfil Checkout Delivery Address Component', () => {
  let component: CamfilCheckoutDeliveryAddressComponent;
  let fixture: ComponentFixture<CamfilCheckoutDeliveryAddressComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CamfilCheckoutDeliveryAddressComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilCheckoutDeliveryAddressComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.address = BasketMockData.getAddress();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
