import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { AppFacade } from 'ish-core/facades/app.facade';
import { ContentIncludeComponent } from 'ish-shared/cms/components/content-include/content-include.component';
import { CamfilBulletListComponent } from 'ish-shared/components/common/camfil-bullet-list/camfil-bullet-list.component';
import { CamfilDetailsBoxComponent } from 'ish-shared/components/common/camfil-details-box/camfil-details-box.component';
import { CamfilHeaderBoxComponent } from 'ish-shared/components/common/camfil-header-box/camfil-header-box.component';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { CamfilLoginFormComponent } from './camfil-login-form/camfil-login-form.component';
import { LoginInfoSectionComponent } from './camfil-login-info-section/login-info-section.component';
import { CamfilLoginNewCustomerComponent } from './camfil-login-new-customer/camfil-login-new-customer.component';
import { CamfilLoginPageComponent } from './camfil-login-page.component';

describe('Camfil Login Page Component', () => {
  let fixture: ComponentFixture<CamfilLoginPageComponent>;
  let component: CamfilLoginPageComponent;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      declarations: [
        CamfilBulletListComponent,
        CamfilDetailsBoxComponent,
        CamfilHeaderBoxComponent,
        CamfilLoginFormComponent,
        CamfilLoginNewCustomerComponent,
        CamfilLoginPageComponent,
        LoginInfoSectionComponent,
        MockComponent(ContentIncludeComponent),
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
    fixture = TestBed.createComponent(CamfilLoginPageComponent);
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
