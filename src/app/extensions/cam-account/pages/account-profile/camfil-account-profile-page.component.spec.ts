import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { MockComponent, MockDirective } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { AccountFacade } from 'ish-core/facades/account.facade';
import { AppFacade } from 'ish-core/facades/app.facade';
import { CamfilErrorComponent } from 'ish-shared/components/common/camfil-error/camfil-error.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { CamAccountFacade } from '../../facades/cam-account.facade';

import { CamfilAccountDetailsFormComponent } from './camfil-account-details-form/camfil-account-details-form.component';
import { CamfilAccountLanguageFormComponent } from './camfil-account-language-form/camfil-account-language-form.component';
import { CamfilAccountPasswordFormComponent } from './camfil-account-password-form/camfil-account-password-form.component';
import { CamfilAccountProfilePageComponent } from './camfil-account-profile-page.component';
import { CamfilAccountProfileComponent } from './camfil-account-profile/camfil-account-profile.component';

describe('Camfil Account Profile Page Component', () => {
  let component: CamfilAccountProfilePageComponent;
  let fixture: ComponentFixture<CamfilAccountProfilePageComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CamfilAccountDetailsFormComponent,
        CamfilAccountLanguageFormComponent,
        CamfilAccountPasswordFormComponent,
        CamfilAccountProfileComponent,
        CamfilAccountProfilePageComponent,
        CamfilErrorComponent,
        MockComponent(FaIconComponent),
        MockComponent(LoadingComponent),
        MockDirective(ServerHtmlDirective),
      ],
      providers: [
        { provide: AccountFacade, useFactory: () => instance(mock(AccountFacade)) },
        { provide: AppFacade, useFactory: () => instance(mock(AppFacade)) },
        { provide: CamAccountFacade, useFactory: () => instance(mock(CamAccountFacade)) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilAccountProfilePageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
