import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { MockComponent, MockDirective } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { AccountFacade } from 'ish-core/facades/account.facade';
import { CamfilErrorComponent } from 'ish-shared/components/common/camfil-error/camfil-error.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { CamfilAccountProfilePageComponent } from './camfil-account-profile-page.component';
import { CamfilChangePasswordComponent } from './camfil-change-password/camfil-change-password.component';
import { CamfilPersonalInfoComponent } from './camfil-personal-info-form/camfil-personal-info.component';
import { CamfilAccountProfileComponent } from './camil-account-profile/camfil-account-profile.component';

describe('Camfil Account Profile Page Component', () => {
  let component: CamfilAccountProfilePageComponent;
  let fixture: ComponentFixture<CamfilAccountProfilePageComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CamfilAccountProfileComponent,
        CamfilAccountProfilePageComponent,
        CamfilChangePasswordComponent,
        CamfilErrorComponent,
        CamfilPersonalInfoComponent,
        MockComponent(FaIconComponent),
        MockComponent(LoadingComponent),
        MockDirective(ServerHtmlDirective),
      ],
      providers: [{ provide: AccountFacade, useFactory: () => instance(mock(AccountFacade)) }],
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
