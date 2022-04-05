import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { provideMockStore } from '@ngrx/store/testing';
import { CheckoutFacade } from 'camfil-pwa/facades/checkout.facade';
import { instance, mock } from 'ts-mockito';

import { CamfilMaxLengthAttributeCreateDirective } from 'ish-core/directives/camfil-max-length-attribute-create.directive';
import { CamfilErrorComponent } from 'ish-shared/components/common/camfil-error/camfil-error.component';

import { CamfilCheckoutGoodsAcceptanceModalComponent } from './camfil-checkout-goods-acceptance-modal.component';

describe('Camfil Checkout Goods Acceptance Modal Component', () => {
  let component: CamfilCheckoutGoodsAcceptanceModalComponent;
  let fixture: ComponentFixture<CamfilCheckoutGoodsAcceptanceModalComponent>;
  let element: HTMLElement;
  let checkoutFacadeMock: CheckoutFacade;

  beforeEach(async () => {
    checkoutFacadeMock = mock(CheckoutFacade);
    await TestBed.configureTestingModule({
      declarations: [
        CamfilCheckoutGoodsAcceptanceModalComponent,
        CamfilErrorComponent,
        CamfilMaxLengthAttributeCreateDirective,
      ],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        { provide: CheckoutFacade, useFactory: () => instance(checkoutFacadeMock) },
        provideMockStore(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilCheckoutGoodsAcceptanceModalComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
