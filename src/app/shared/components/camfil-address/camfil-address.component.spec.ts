import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';

import { CamfilAddressComponent } from './camfil-address.component';

describe('Camfil Address Component', () => {
  let component: CamfilAddressComponent;
  let fixture: ComponentFixture<CamfilAddressComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CamfilAddressComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilAddressComponent);
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
