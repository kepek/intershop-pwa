import { ComponentFixture, TestBed } from '@angular/core/testing';
import { instance, mock } from 'ts-mockito';

import { CamfilMaxLengthAttributeCreateDirective } from 'ish-core/directives/camfil-max-length-attribute-create.directive';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';

import { CamConfigurationFacade } from '../../../extensions/cam-configuration/facades/cam-configuration.facade';

import { CamfilCheckoutGuestFormComponent } from './camfil-checkout-guest-form.component';

describe('Camfil Checkout Guest Form Component', () => {
  let component: CamfilCheckoutGuestFormComponent;
  let fixture: ComponentFixture<CamfilCheckoutGuestFormComponent>;
  let element: HTMLElement;
  let camConfigurationFacade: CamConfigurationFacade;
  let checkoutFacadeMock: CheckoutFacade;

  beforeEach(async () => {
    camConfigurationFacade = mock(CamConfigurationFacade);
    checkoutFacadeMock = mock(CheckoutFacade);
    await TestBed.configureTestingModule({
      declarations: [CamfilGuestFormComponent, CamfilMaxLengthAttributeCreateDirective],
      providers: [
        { provide: CamConfigurationFacade, useFactory: () => instance(camConfigurationFacade) },
        { provide: CheckoutFacade, useFactory: () => instance(checkoutFacadeMock) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilCheckoutGuestFormComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
