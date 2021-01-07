import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { AccountFacade } from 'ish-core/facades/account.facade';
import { CamfilErrorComponent } from 'ish-shared/components/common/camfil-error/camfil-error.component';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { LazyCamCaptchaComponent } from '../../../../cam-captcha/exports/lazy-cam-captcha/lazy-cam-captcha.component';
import { CamAccountFacade } from '../../../facades/cam-account.facade';
import { CamfilRequestUserAccountsFormComponent } from '../camfil-request-user-accounts-form/camfil-request-user-accounts-form.component';

import { CamfilRequestUserAccountsComponent } from './camfil-request-user-accounts.component';

describe('Camfil Request User Accounts Component', () => {
  let component: CamfilRequestUserAccountsComponent;
  let fixture: ComponentFixture<CamfilRequestUserAccountsComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CamfilErrorComponent,
        CamfilRequestUserAccountsComponent,
        CamfilRequestUserAccountsFormComponent,
        ErrorMessageComponent,
        MockComponent(LazyCamCaptchaComponent),
        MockComponent(LoadingComponent),
        MockDirective(ServerHtmlDirective),
      ],
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      providers: [
        { provide: AccountFacade, useFactory: () => instance(mock(AccountFacade)) },
        { provide: CamAccountFacade, useFactory: () => instance(mock(CamAccountFacade)) },
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
