import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AuthorizationToggleModule } from 'ish-core/authorization-toggle.module';
import { AccountFacade } from 'ish-core/facades/account.facade';
import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { CamfilAccountNavigationComponent } from './camfil-account-navigation.component';

describe('Camfil Account Navigation Component', () => {
  let component: CamfilAccountNavigationComponent;
  let fixture: ComponentFixture<CamfilAccountNavigationComponent>;
  let element: HTMLElement;
  let accountFacadeMock: AccountFacade;

  beforeEach(async () => {
    accountFacadeMock = mock(AccountFacade);
    await TestBed.configureTestingModule({
      declarations: [CamfilAccountNavigationComponent, MockComponent(LoadingComponent)],
      imports: [
        AuthorizationToggleModule.forTesting('APP_B2B_MANAGE_USERS'),
        FeatureToggleModule.forTesting('quoting', 'orderTemplates'),
        RouterTestingModule,
        TranslateModule.forRoot(),
      ],
      providers: [{ provide: AccountFacade, useFactory: () => instance(accountFacadeMock) }],
    }).compileComponents();

    when(accountFacadeMock.isBusinessCustomer$).thenReturn(of(true));
    when(accountFacadeMock.userPermissions$).thenReturn(of(['APP_B2B_MANAGE_USERS']));
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilAccountNavigationComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  xit('should display link to quote list', () => {
    fixture.detectChanges();
    expect(element.textContent).toContain('account.navigation.quotes.link');
  });

  xit('should display link to order templates list', () => {
    fixture.detectChanges();
    expect(element.textContent).toContain('account.ordertemplates.link');
  });

  xit('should display link to user list', () => {
    fixture.detectChanges();
    expect(element.textContent).toContain('account.organization.user_management');
  });
});
