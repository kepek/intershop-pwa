import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { AccountFacade } from 'ish-core/facades/account.facade';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { RemindPasswordFormComponent } from '../remind-password-form/remind-password-form.component';
import { UpdatePasswordFormComponent } from '../update-password-form/update-password-form.component';

import { RemindPasswordComponent } from './remind-password.component';

describe('Remind Password Component', () => {
  let component: RemindPasswordComponent;
  let fixture: ComponentFixture<RemindPasswordComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        MockComponent(ErrorMessageComponent),
        MockComponent(LoadingComponent),
        MockComponent(RemindPasswordFormComponent),
        MockComponent(UpdatePasswordFormComponent),
        MockDirective(ServerHtmlDirective),
        RemindPasswordComponent,
      ],
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      providers: [{ provide: AccountFacade, useFactory: () => instance(mock(AccountFacade)) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RemindPasswordComponent);
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
