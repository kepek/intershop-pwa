import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CamfilDeliveryAddressComponent } from './camfil-delivery-address.component';

describe('Camfil Delivery Address Component', () => {
  let component: CamfilDeliveryAddressComponent;
  let fixture: ComponentFixture<CamfilDeliveryAddressComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CamfilDeliveryAddressComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilDeliveryAddressComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.deliveryAddress = {
      deliveryAddressName: 'deliveryaddr-ABCDEFGPRMuMCscyXgSRVU',
      deliveryAddressName2: undefined,
      deliveryAddressAddress: 'Potsdamer Str. 20',
      deliveryAddressZipCode: '14483',
      deliveryAddressCity: 'Berlin',
    };
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
