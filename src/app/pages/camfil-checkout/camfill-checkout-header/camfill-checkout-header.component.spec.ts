import { ComponentFixture, TestBed } from '@angular/core/testing';
import { instance, mock } from 'ts-mockito';

import { Basket } from 'ish-core/models/basket/basket.model';
import { CamfilSmallCtaModalComponent } from 'ish-shared/components/common/camfil-small-cta-modal/camfil-small-cta-modal.component';

import { CamCardsFacade } from '../../../extensions/cam-cards/facades/cam-cards.facade';
import { CamfillCheckoutToolbarComponent } from '../camfill-checkout-toolbar/camfill-checkout-toolbar.component';
import { CreateNewCamcardComponent } from '../camfill-checkout-toolbar/create-new-camcard/create-new-camcard.component';

import { CamfillCheckoutHeaderComponent } from './camfill-checkout-header.component';

describe('Camfill Checkout Header Component', () => {
  let component: CamfillCheckoutHeaderComponent;
  let fixture: ComponentFixture<CamfillCheckoutHeaderComponent>;
  let element: HTMLElement;
  let basket: Basket;
  let camCardFacadeMock: CamCardsFacade;

  beforeEach(async () => {
    camCardFacadeMock = mock(CamCardsFacade);

    await TestBed.configureTestingModule({
      declarations: [
        CamfilSmallCtaModalComponent,
        CamfillCheckoutHeaderComponent,
        CamfillCheckoutToolbarComponent,
        CreateNewCamcardComponent,
      ],
      providers: [{ provide: CamCardsFacade, useFactory: () => instance(camCardFacadeMock) }],
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
