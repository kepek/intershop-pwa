import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';

import { CamfilErrorComponent } from 'ish-shared/components/common/camfil-error/camfil-error.component';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';

import { LazyCamCaptchaComponent } from '../../../../cam-captcha/exports/lazy-cam-captcha/lazy-cam-captcha.component';

import { CamfilRequestUserAccountsFormComponent } from './camfil-request-user-accounts-form.component';

describe('Camfil Request User Accounts Form Component', () => {
  let component: CamfilRequestUserAccountsFormComponent;
  let fixture: ComponentFixture<CamfilRequestUserAccountsFormComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CamfilErrorComponent,
        CamfilRequestUserAccountsFormComponent,
        MockComponent(ErrorMessageComponent),
        MockComponent(LazyCamCaptchaComponent),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilRequestUserAccountsFormComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
