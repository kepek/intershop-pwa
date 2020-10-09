import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { AppFacade } from 'ish-core/facades/app.facade';
import { CamfilBulletListComponent } from 'ish-shared/components/common/camfil-bullet-list/camfil-bullet-list.component';
import { CamfilDetailsBoxComponent } from 'ish-shared/components/common/camfil-details-box/camfil-details-box.component';
import { CamfilHeaderBoxComponent } from 'ish-shared/components/common/camfil-header-box/camfil-header-box.component';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { LoginFormComponent } from './login-form/login-form.component';
import { LoginInfoSectionComponent } from './login-info-section/login-info-section.component';
import { LoginNewCustomerComponent } from './login-new-customer/login-new-customer.component';
import { LoginPageComponent } from './login-page.component';

describe('Login Page Component', () => {
  let fixture: ComponentFixture<LoginPageComponent>;
  let component: LoginPageComponent;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      declarations: [
        CamfilBulletListComponent,
        CamfilDetailsBoxComponent,
        CamfilHeaderBoxComponent,
        LoginFormComponent,
        LoginInfoSectionComponent,
        LoginNewCustomerComponent,
        LoginPageComponent,
        MockComponent(ErrorMessageComponent),
        MockComponent(LoadingComponent),
      ],
      providers: [
        { provide: AccountFacade, useFactory: () => instance(mock(AccountFacade)) },
        { provide: AppFacade, useFactory: () => instance(mock(AppFacade)) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render login form container on Login page', () => {
    fixture.detectChanges();
    expect(element.querySelector('camfil-login-form')).toBeTruthy();
  });
});
