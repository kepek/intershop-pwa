import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { CamfilErrorComponent } from 'ish-shared/components/common/camfil-error/camfil-error.component';
import { InputComponent } from 'ish-shared/forms/components/input/input.component';

import { LazyCaptchaComponent } from '../../../../captcha/exports/lazy-captcha/lazy-captcha.component';

import { RemindPasswordFormComponent } from './remind-password-form.component';

describe('Remind Password Form Component', () => {
  let component: RemindPasswordFormComponent;
  let fixture: ComponentFixture<RemindPasswordFormComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CamfilErrorComponent,
        MockComponent(InputComponent),
        MockComponent(LazyCaptchaComponent),
        RemindPasswordFormComponent,
      ],
      imports: [ReactiveFormsModule, TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RemindPasswordFormComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render forgot password form for password reminder', () => {
    fixture.detectChanges();

    expect(element.querySelector('input[name=usernameFormControl]')).toBeTruthy();
    expect(element.querySelector('[name="passwordReminder"]')).toBeTruthy();
  });
});
