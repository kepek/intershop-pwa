import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Basket } from 'ish-core/models/basket/basket.model';

import { CamfillCheckoutToolbarComponent } from '../camfill-checkout-toolbar/camfill-checkout-toolbar.component';

import { CamfillCheckoutHeaderComponent } from './camfill-checkout-header.component';

describe('Camfill Checkout Header Component', () => {
  let component: CamfillCheckoutHeaderComponent;
  let fixture: ComponentFixture<CamfillCheckoutHeaderComponent>;
  let element: HTMLElement;
  let basket: Basket;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CamfillCheckoutHeaderComponent, CamfillCheckoutToolbarComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfillCheckoutHeaderComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    basket = { id: '1' } as Basket;
    basket.totalProductQuantity = 8;
    basket.buckets = ['1', '2', '3'];

    component.basket = basket;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
