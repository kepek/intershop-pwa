import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CamfilRemindPasswordFormComponent } from 'camfil-pwa/pages/camfil-forgot-password/camfil-remind-password-form/camfil-remind-password-form.component';
import { CamfilUpdatePasswordFormComponent } from 'camfil-pwa/pages/camfil-forgot-password/camfil-update-password-form/camfil-update-password-form.component';
import { MockComponent, MockDirective } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { AccountFacade } from 'ish-core/facades/account.facade';
import { ContentIncludeComponent } from 'ish-shared/cms/components/content-include/content-include.component';
import { CamfilErrorMessageComponent } from 'ish-shared/components/common/camfil-error-message/camfil-error-message.component';
import { CamfilLoadingComponent } from 'ish-shared/components/common/camfil-loading/camfil-loading.component';

import { CamfilRemindPasswordComponent } from './camfil-remind-password.component';

describe('Camfil Remind Password Component', () => {
  let component: CamfilRemindPasswordComponent;
  let fixture: ComponentFixture<CamfilRemindPasswordComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CamfilRemindPasswordComponent,
        MockComponent(CamfilErrorMessageComponent),
        MockComponent(CamfilLoadingComponent),
        MockComponent(CamfilRemindPasswordFormComponent),
        MockComponent(CamfilUpdatePasswordFormComponent),
        MockComponent(ContentIncludeComponent),
        MockDirective(ServerHtmlDirective),
      ],
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      providers: [{ provide: AccountFacade, useFactory: () => instance(mock(AccountFacade)) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilRemindPasswordComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render request reminder form on forgot-password request reminder page', () => {
    fixture.detectChanges();
    expect(element.querySelector('camfil-remind-password-form')).toBeTruthy();
  });
});
