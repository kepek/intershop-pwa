import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';

import { CamfilPaymentConcardisComponent } from './camfil-payment-concardis.component';

describe('Camfil Payment Concardis Component', () => {
  let component: CamfilPaymentConcardisComponent;
  let fixture: ComponentFixture<CamfilPaymentConcardisComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CamfilPaymentConcardisComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilPaymentConcardisComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.paymentMethod = {
      id: 'Concardis_CreditCard',
      saveAllowed: false,
    } as PaymentMethod;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
