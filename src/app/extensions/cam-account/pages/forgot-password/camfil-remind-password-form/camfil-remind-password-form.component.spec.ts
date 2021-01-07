import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { CamfilErrorComponent } from 'ish-shared/components/common/camfil-error/camfil-error.component';
import { InputComponent } from 'ish-shared/forms/components/input/input.component';

import { LazyCamCaptchaComponent } from '../../../../cam-captcha/exports/lazy-cam-captcha/lazy-cam-captcha.component';

import { CamfilRemindPasswordFormComponent } from './camfil-remind-password-form.component';

describe('Camfil Remind Password Form Component', () => {
  let component: CamfilRemindPasswordFormComponent;
  let fixture: ComponentFixture<CamfilRemindPasswordFormComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CamfilErrorComponent,
        CamfilRemindPasswordFormComponent,
        MockComponent(InputComponent),
        MockComponent(LazyCamCaptchaComponent),
      ],
      imports: [ReactiveFormsModule, TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilRemindPasswordFormComponent);
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
