import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { CamfilMaxLengthAttributeCreateDirective } from 'ish-core/directives/camfil-max-length-attribute-create.directive';
import { AppFacade } from 'ish-core/facades/app.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { CamfilCityFieldComponent } from 'ish-shared/components/common/camfil-city-field/camfil-city-field.component';
import { CamfilErrorComponent } from 'ish-shared/components/common/camfil-error/camfil-error.component';
import { ZipCodeComponent } from 'ish-shared/components/zip-code/zip-code.component';

import { CamfilConfigurationFacade } from '../../../extensions/cam-configuration/facades/camfil-configuration.facade';

import { CamfilCheckoutGuestFormComponent } from './camfil-checkout-guest-form.component';

describe('Camfil Checkout Guest Form Component', () => {
  let component: CamfilCheckoutGuestFormComponent;
  let fixture: ComponentFixture<CamfilCheckoutGuestFormComponent>;
  let element: HTMLElement;
  let camConfigurationFacade: CamfilConfigurationFacade;
  let checkoutFacadeMock: CheckoutFacade;
  let shoppingFacade: ShoppingFacade;
  let appFacade: AppFacade;

  beforeEach(async () => {
    camConfigurationFacade = mock(CamfilConfigurationFacade);
    checkoutFacadeMock = mock(CheckoutFacade);
    shoppingFacade = mock(ShoppingFacade);
    appFacade = mock(AppFacade);
    await TestBed.configureTestingModule({
      declarations: [
        CamfilCheckoutGuestFormComponent,
        CamfilMaxLengthAttributeCreateDirective,
        MockComponent(CamfilCityFieldComponent),
        MockComponent(CamfilErrorComponent),
        MockComponent(ZipCodeComponent),
      ],
      providers: [
        { provide: CamfilConfigurationFacade, useFactory: () => instance(camConfigurationFacade) },
        { provide: CheckoutFacade, useFactory: () => instance(checkoutFacadeMock) },
        { provide: ShoppingFacade, useFactory: () => instance(shoppingFacade) },
        { provide: AppFacade, useFactory: () => instance(appFacade) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    when(checkoutFacadeMock.submittedAnonymousBasketExtension$).thenReturn(of(undefined));
    when(checkoutFacadeMock.anonymousBasketExtension$).thenReturn(of(undefined));
    when(shoppingFacade.basketAddresses$).thenReturn(of([]));

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
