import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { CamfilBreadcrumbComponent } from 'ish-shared/components/common/camfil-breadcrumb/camfil-breadcrumb.component';

import { CamfilCheckoutSummaryComponent } from './camfil-checkout-summary/camfil-checkout-summary.component';
import { CamfillCheckoutHeaderComponent } from './camfill-checkout-header/camfill-checkout-header.component';
import { CamfillCheckoutToolbarComponent } from './camfill-checkout-toolbar/camfill-checkout-toolbar.component';
import { CheckoutPageComponent } from './checkout-page.component';

describe('Checkout Page Component', () => {
  let fixture: ComponentFixture<CheckoutPageComponent>;
  let component: CheckoutPageComponent;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CheckoutPageComponent,
        MockComponent(CamfilBreadcrumbComponent),
        MockComponent(CamfilCheckoutSummaryComponent),
        MockComponent(CamfillCheckoutHeaderComponent),
        MockComponent(CamfillCheckoutToolbarComponent),
      ],
      imports: [RouterTestingModule],
      providers: [{ provide: CheckoutFacade, useFactory: () => instance(mock(CheckoutFacade)) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
