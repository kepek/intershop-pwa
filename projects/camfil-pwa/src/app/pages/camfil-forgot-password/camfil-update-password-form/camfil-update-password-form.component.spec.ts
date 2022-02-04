import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { CamfilErrorComponent } from 'ish-shared/components/common/camfil-error/camfil-error.component';
import { InputComponent } from 'ish-shared/forms/components/input/input.component';

import { CamfilUpdatePasswordFormComponent } from './camfil-update-password-form.component';

describe('Camfil Update Password Form Component', () => {
  let component: CamfilUpdatePasswordFormComponent;
  let fixture: ComponentFixture<CamfilUpdatePasswordFormComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CamfilErrorComponent, CamfilUpdatePasswordFormComponent, MockComponent(InputComponent)],
      imports: [ReactiveFormsModule, TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilUpdatePasswordFormComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render forgot password form step 2 for password reminder', () => {
    fixture.detectChanges();
    expect(element.querySelector('input[id=passwordFormControl]')).toBeTruthy();
    expect(element.querySelector('input[id=passwordConfirmationFormControl]')).toBeTruthy();
    expect(element.querySelector('[name="SubmitButton"]')).toBeTruthy();
  });
});
