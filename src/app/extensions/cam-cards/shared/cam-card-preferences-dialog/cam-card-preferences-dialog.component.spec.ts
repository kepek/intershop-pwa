import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgbModalModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { spy, verify } from 'ts-mockito';

import { CheckboxComponent } from 'ish-shared/forms/components/checkbox/checkbox.component';
import { InputComponent } from 'ish-shared/forms/components/input/input.component';

import { CamCardPreferencesDialogComponent } from './cam-card-preferences-dialog.component';

describe('Cam Card Preferences Dialog Component', () => {
  let component: CamCardPreferencesDialogComponent;
  let fixture: ComponentFixture<CamCardPreferencesDialogComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CamCardPreferencesDialogComponent,
        MockComponent(CheckboxComponent),
        MockComponent(FaIconComponent),
        MockComponent(InputComponent),
      ],
      imports: [NgbModalModule, NgbPopoverModule, ReactiveFormsModule, TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamCardPreferencesDialogComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should emit new cam cards data when submit form was called and the form was valid', done => {
    fixture.detectChanges();
    component.camCardForm.setValue({
      title: 'test cam cards',
    });

    component.submit.subscribe(emit => {
      expect(emit).toEqual({
        id: 'test cam cards',
        title: 'test cam cards',
      });
      done();
    });

    component.submitCamCardForm();
  });

  it('should not emit new cam cards data when submit form was called and the form was invalid', () => {
    component.ngOnChanges();
    fixture.detectChanges();
    const emitter = spy(component.submit);
    component.submitCamCardForm();

    verify(emitter.emit()).never();
  });
});
