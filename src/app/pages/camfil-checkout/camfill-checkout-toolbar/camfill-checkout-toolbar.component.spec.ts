import { ComponentFixture, TestBed } from '@angular/core/testing';
import { instance, mock } from 'ts-mockito';

import { CamfilSmallCtaModalComponent } from 'ish-shared/components/common/camfil-small-cta-modal/camfil-small-cta-modal.component';

import { CamCardsFacade } from '../../../extensions/cam-cards/facades/cam-cards.facade';

import { CamfillCheckoutToolbarComponent } from './camfill-checkout-toolbar.component';
import { CreateNewCamcardComponent } from './create-new-camcard/create-new-camcard.component';

describe('Camfill Checkout Toolbar Component', () => {
  let component: CamfillCheckoutToolbarComponent;
  let fixture: ComponentFixture<CamfillCheckoutToolbarComponent>;
  let element: HTMLElement;
  let camCardFacadeMock: CamCardsFacade;

  beforeEach(async () => {
    camCardFacadeMock = mock(CamCardsFacade);

    await TestBed.configureTestingModule({
      declarations: [CamfilSmallCtaModalComponent, CamfillCheckoutToolbarComponent, CreateNewCamcardComponent],
      providers: [{ provide: CamCardsFacade, useFactory: () => instance(camCardFacadeMock) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfillCheckoutToolbarComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
