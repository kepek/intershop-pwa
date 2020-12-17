import { ComponentFixture, TestBed } from '@angular/core/testing';
import { instance, mock } from 'ts-mockito';

import { CamfilSmallCtaModalComponent } from 'ish-shared/components/common/camfil-small-cta-modal/camfil-small-cta-modal.component';

import { CamCardsFacade } from '../../../../extensions/cam-cards/facades/cam-cards.facade';

import { CreateNewCamcardComponent } from './create-new-camcard.component';

describe('Create New Camcard Component', () => {
  let component: CreateNewCamcardComponent;
  let fixture: ComponentFixture<CreateNewCamcardComponent>;
  let element: HTMLElement;
  let camCardFacadeMock: CamCardsFacade;

  beforeEach(async () => {
    camCardFacadeMock = mock(CamCardsFacade);

    await TestBed.configureTestingModule({
      declarations: [CamfilSmallCtaModalComponent, CreateNewCamcardComponent],
      providers: [{ provide: CamCardsFacade, useFactory: () => instance(camCardFacadeMock) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNewCamcardComponent);
    component = fixture.componentInstance;
    component.buckets = [];
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
