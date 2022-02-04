import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CamfilPwaFacade } from 'camfil-pwa/facades/camfil-pwa.facade';
import { CamfilRequestUserAccountsFormComponent } from 'camfil-pwa/pages/camfil-forgot-username/camfil-request-user-accounts-form/camfil-request-user-accounts-form.component';
import { MockComponent, MockDirective } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { AccountFacade } from 'ish-core/facades/account.facade';
import { CamfilErrorMessageComponent } from 'ish-shared/components/common/camfil-error-message/camfil-error-message.component';
import { CamfilErrorComponent } from 'ish-shared/components/common/camfil-error/camfil-error.component';
import { CamfilLoadingComponent } from 'ish-shared/components/common/camfil-loading/camfil-loading.component';

import { LazyCamCaptchaComponent } from '../../../../../../../src/app/extensions/cam-captcha/exports/lazy-cam-captcha/lazy-cam-captcha.component';

import { CamfilRequestUserAccountsComponent } from './camfil-request-user-accounts.component';

describe('Camfil Request User Accounts Component', () => {
  let component: CamfilRequestUserAccountsComponent;
  let fixture: ComponentFixture<CamfilRequestUserAccountsComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CamfilErrorComponent,
        CamfilErrorMessageComponent,
        CamfilRequestUserAccountsComponent,
        CamfilRequestUserAccountsFormComponent,
        MockComponent(CamfilLoadingComponent),
        MockComponent(LazyCamCaptchaComponent),
        MockDirective(ServerHtmlDirective),
      ],
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      providers: [
        { provide: AccountFacade, useFactory: () => instance(mock(AccountFacade)) },
        { provide: CamfilPwaFacade, useFactory: () => instance(mock(CamfilPwaFacade)) },
        provideMockStore(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilRequestUserAccountsComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
