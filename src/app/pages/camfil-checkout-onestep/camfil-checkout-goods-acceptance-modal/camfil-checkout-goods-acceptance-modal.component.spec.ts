import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { provideMockStore } from '@ngrx/store/testing';
import { CamfilConfigurationFacade } from 'camfil-pwa/facades/camfil-configuration.facade';
import { IshCheckoutFacade } from 'camfil-pwa/facades/ish-checkout.facade';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { CamfilMaxLengthAttributeCreateDirective } from 'ish-core/directives/camfil-max-length-attribute-create.directive';
import { CamfilErrorComponent } from 'ish-shared/components/common/camfil-error/camfil-error.component';

import { CamfilCheckoutGoodsAcceptanceModalComponent } from './camfil-checkout-goods-acceptance-modal.component';

describe('Camfil Checkout Goods Acceptance Modal Component', () => {
  let component: CamfilCheckoutGoodsAcceptanceModalComponent;
  let fixture: ComponentFixture<CamfilCheckoutGoodsAcceptanceModalComponent>;
  let element: HTMLElement;
  let checkoutFacadeMock: IshCheckoutFacade;
  let camfilConfigurationFacade: CamfilConfigurationFacade;

  beforeEach(async () => {
    checkoutFacadeMock = mock(IshCheckoutFacade);
    camfilConfigurationFacade = mock(CamfilConfigurationFacade);
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
        { provide: IshCheckoutFacade, useFactory: () => instance(checkoutFacadeMock) },
        { provide: CamfilConfigurationFacade, useFactory: () => instance(camfilConfigurationFacade) },
        provideMockStore(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilCheckoutGoodsAcceptanceModalComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    when(camfilConfigurationFacade.isEnabled$('goodsAcceptanceTimeMandatory')).thenReturn(of(false));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
