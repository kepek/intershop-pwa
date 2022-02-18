import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CamfilRemindPasswordFormComponent } from 'camfil-pwa/pages/camfil-forgot-password/camfil-remind-password-form/camfil-remind-password-form.component';
import { CamfilUpdatePasswordFormComponent } from 'camfil-pwa/pages/camfil-forgot-password/camfil-update-password-form/camfil-update-password-form.component';
import { MockComponent, MockDirective } from 'ng-mocks';
import { EMPTY } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { AccountFacade } from 'ish-core/facades/account.facade';
import { CamfilErrorMessageComponent } from 'ish-shared/components/common/camfil-error-message/camfil-error-message.component';
import { CamfilLoadingComponent } from 'ish-shared/components/common/camfil-loading/camfil-loading.component';

import { CamfilUpdatePasswordComponent } from './camfil-update-password.component';

describe('Camfil Update Password Component', () => {
  let component: CamfilUpdatePasswordComponent;
  let fixture: ComponentFixture<CamfilUpdatePasswordComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    const accountFacade = mock(AccountFacade);
    when(accountFacade.passwordReminderSuccess$).thenReturn(EMPTY);

    await TestBed.configureTestingModule({
      declarations: [
        CamfilUpdatePasswordComponent,
        MockComponent(CamfilErrorMessageComponent),
        MockComponent(CamfilLoadingComponent),
        MockComponent(CamfilRemindPasswordFormComponent),
        MockComponent(CamfilUpdatePasswordFormComponent),
        MockDirective(ServerHtmlDirective),
      ],
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      providers: [{ provide: AccountFacade, useFactory: () => instance(accountFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilUpdatePasswordComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render update password form on forgot-password update password page', () => {
    component.secureCode = 'abc';
    component.userID = 'a123';
    fixture.detectChanges();
    expect(element.querySelector('camfil-update-password-form')).toBeTruthy();
  });
});
