import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { EMPTY, Subject } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ContentIncludeComponent } from 'ish-shared/cms/components/content-include/content-include.component';
import { CamfilErrorComponent } from 'ish-shared/components/common/camfil-error/camfil-error.component';
import { CamfilSmallCtaModalComponent } from 'ish-shared/components/common/camfil-small-cta-modal/camfil-small-cta-modal.component';

import { CamCardsFacade } from '../../../facades/cam-cards.facade';

import { ModalAddNewSectionComponent } from './modal-add-new-section.component';

describe('Modal Add New Section Component', () => {
  let component: ModalAddNewSectionComponent;
  let fixture: ComponentFixture<ModalAddNewSectionComponent>;
  let element: HTMLElement;
  let camCardFacadeMock: CamCardsFacade;

  beforeEach(async () => {
    camCardFacadeMock = mock(CamCardsFacade);
    when(camCardFacadeMock.currentCamCard$).thenReturn(EMPTY);

    await TestBed.configureTestingModule({
      declarations: [
        CamfilErrorComponent,
        CamfilSmallCtaModalComponent,
        MockComponent(ContentIncludeComponent),
        ModalAddNewSectionComponent,
      ],
      providers: [{ provide: CamCardsFacade, useFactory: () => instance(camCardFacadeMock) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAddNewSectionComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.events = new Subject<void>().asObservable();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
