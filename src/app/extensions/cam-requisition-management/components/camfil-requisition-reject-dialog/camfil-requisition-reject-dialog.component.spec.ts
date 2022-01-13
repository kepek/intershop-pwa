import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { instance, mock, spy, verify } from 'ts-mockito';

import { CamfilMaxLengthAttributeCreateDirective } from 'ish-core/directives/camfil-max-length-attribute-create.directive';
import { CamfilErrorMessageComponent } from 'ish-shared/components/common/camfil-error-message/camfil-error-message.component';
import { TextareaComponent } from 'ish-shared/forms/components/textarea/textarea.component';

import { CamRequisitionManagementFacade } from '../../facades/cam-requisition-management.facade';

import { CamfilRequisitionRejectDialogComponent } from './camfil-requisition-reject-dialog.component';

describe('Camfil Requisition Reject Dialog Component', () => {
  let component: CamfilRequisitionRejectDialogComponent;
  let fixture: ComponentFixture<CamfilRequisitionRejectDialogComponent>;
  let element: HTMLElement;
  let camRequisitionManagementFacade: CamRequisitionManagementFacade;

  beforeEach(async () => {
    camRequisitionManagementFacade = mock(CamRequisitionManagementFacade);
    await TestBed.configureTestingModule({
      declarations: [
        CamfilMaxLengthAttributeCreateDirective,
        CamfilRequisitionRejectDialogComponent,
        MockComponent(CamfilErrorMessageComponent),
        MockComponent(TextareaComponent),
      ],
      imports: [ReactiveFormsModule, TranslateModule.forRoot()],
      providers: [
        { provide: CamRequisitionManagementFacade, useFactory: () => instance(camRequisitionManagementFacade) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilRequisitionRejectDialogComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should emit approval comment when submit form was called and the form was valid', done => {
    fixture.detectChanges();
    component.rejectForm.setValue({
      comment: 'test comment',
    });

    component.submit.subscribe(emit => {
      expect(emit).toEqual('test comment');
      done();
    });

    component.submitForm();
  });

  it('should not emit new approval comment when submit form was called and the form was invalid', () => {
    fixture.detectChanges();
    const emitter = spy(component.submit);
    component.submitForm();

    verify(emitter.emit()).never();
  });
});
