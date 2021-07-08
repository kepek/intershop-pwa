import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { AccountFacade } from 'ish-core/facades/account.facade';
import { ContentIncludeComponent } from 'ish-shared/cms/components/content-include/content-include.component';
import { CamfilLoadingComponent } from 'ish-shared/components/common/camfil-loading/camfil-loading.component';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';

import { CamfilRemindPasswordFormComponent } from '../camfil-remind-password-form/camfil-remind-password-form.component';
import { CamfilUpdatePasswordFormComponent } from '../camfil-update-password-form/camfil-update-password-form.component';

import { CamfilRemindPasswordComponent } from './camfil-remind-password.component';

describe('Camfil Remind Password Component', () => {
  let component: CamfilRemindPasswordComponent;
  let fixture: ComponentFixture<CamfilRemindPasswordComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CamfilRemindPasswordComponent,
        MockComponent(CamfilLoadingComponent),
        MockComponent(CamfilRemindPasswordFormComponent),
        MockComponent(CamfilUpdatePasswordFormComponent),
        MockComponent(ContentIncludeComponent),
        MockComponent(ErrorMessageComponent),
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
