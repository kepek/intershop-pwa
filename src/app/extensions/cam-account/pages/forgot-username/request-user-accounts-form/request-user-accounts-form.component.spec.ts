import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';

import { CamfilErrorComponent } from 'ish-shared/components/common/camfil-error/camfil-error.component';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';

import { LazyCamCaptchaComponent } from '../../../../cam-captcha/exports/lazy-cam-captcha/lazy-cam-captcha.component';

import { RequestUserAccountsFormComponent } from './request-user-accounts-form.component';

describe('Request User Accounts Form Component', () => {
  let component: RequestUserAccountsFormComponent;
  let fixture: ComponentFixture<RequestUserAccountsFormComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CamfilErrorComponent,
        MockComponent(ErrorMessageComponent),
        MockComponent(LazyCamCaptchaComponent),
        RequestUserAccountsFormComponent,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestUserAccountsFormComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
