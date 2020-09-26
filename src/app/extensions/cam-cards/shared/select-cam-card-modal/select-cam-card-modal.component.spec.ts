import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';
import { of } from 'rxjs';
import { anything, capture, instance, mock, spy, verify, when } from 'ts-mockito';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { InputComponent } from 'ish-shared/forms/components/input/input.component';

import { CamCardsFacade } from '../../facades/cam-cards.facade';

import { SelectCamCardModalComponent } from './select-cam-card-modal.component';

describe('Select Cam Card Modal Component', () => {
  let component: SelectCamCardModalComponent;
  let fixture: ComponentFixture<SelectCamCardModalComponent>;
  let element: HTMLElement;
  let camCardFacadeMock: CamCardsFacade;
  const camCardDetails = {
    title: 'testing cam cards',
    id: '.SKsEQAE4FIAAAFuNiUBWx0d',
    itemsCount: 0,
    public: false,
  };

  beforeEach(async () => {
    camCardFacadeMock = mock(CamCardsFacade);

    await TestBed.configureTestingModule({
      declarations: [MockComponent(InputComponent), MockDirective(ServerHtmlDirective), SelectCamCardModalComponent],
      imports: [NgbModalModule, ReactiveFormsModule, RouterTestingModule, TranslateModule.forRoot()],
      providers: [{ provide: CamCardsFacade, useFactory: () => instance(camCardFacadeMock) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectCamCardModalComponent);

    component = fixture.componentInstance;
    element = fixture.nativeElement;
    when(camCardFacadeMock.currentCamCard$).thenReturn(of(camCardDetails));
    when(camCardFacadeMock.camCard$).thenReturn(of([camCardDetails]));

    fixture.detectChanges();
    component.show();

    component.camCardOptions = [{ value: 'camCards', label: 'Cam Card' }];
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should emit correct object on form submit with known cam cards', () => {
    const emitter = spy(component.submitEmitter);
    component.updateCamCardForm.patchValue({ camCards: 'camCards' });

    component.submitForm();
    verify(emitter.emit(anything())).once();
    const [arg] = capture(emitter.emit).last();
    expect(arg).toEqual({
      id: 'camCards',
      title: 'Cam Card',
    });
  });

  it('should emit correct object on form submit with new cam_card', () => {
    const emitter = spy(component.submitEmitter);
    component.updateCamCardForm.patchValue({
      camCards: 'newCamCard',
      newCamCard: 'New Cam Card Title',
    });

    component.submitForm();
    verify(emitter.emit(anything())).once();
    const [arg] = capture(emitter.emit).last();
    expect(arg).toEqual({
      id: undefined,
      title: 'New Cam Card Title',
    });
  });

  it('should switch modal contents after successful submit', () => {
    component.updateCamCardForm.patchValue({ camCards: 'camCards' });

    component.submitForm();
    expect(element.querySelector('form')).toBeFalsy();
  });

  it('should ensure that newCamCard remove Validator after being deselected', () => {
    component.updateCamCardForm.patchValue({ camCards: 'camCards', newCamCard: '' });
    expect(component.updateCamCardForm.get('newCamCard').validator).toBeNull();
  });

  describe('selectedCamCardTitle', () => {
    it('should return correct title of known cam cards', () => {
      component.updateCamCardForm.patchValue({ camCards: 'camCards' });
      const title = component.selectedCamCardTitle;
      expect(title).toBe('Cam Card');
    });

    it('should return correct title of new cam cards', () => {
      component.updateCamCardForm.patchValue({
        camCards: 'newCamCard',
        newCamCard: 'New Cam Card Title',
      });
      const title = component.selectedCamCardTitle;
      expect(title).toBe('New Cam Card Title');
    });
  });

  describe('selectedCamCardRoute', () => {
    it('should return correct route of known cam cards', () => {
      component.updateCamCardForm.patchValue({ camCards: 'camCards' });
      const route = component.selectedCamCardRoute;
      expect(route).toBe('route://account/cam-cards/camCards');
    });

    it('should return correct route of new cam cards', () => {
      component.updateCamCardForm.patchValue({
        camCards: 'newCamCard',
        newCamCard: 'New Cam Card Title',
      });
      component.idAfterCreate = 'idAfterCreate';
      const route = component.selectedCamCardRoute;
      expect(route).toBe('route://account/cam-cards/idAfterCreate');
    });
  });
});
