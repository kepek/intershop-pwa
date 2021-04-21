import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { mock, when } from 'ts-mockito';

import { AuthorizationToggleModule } from 'ish-core/authorization-toggle.module';
import { AccountFacade } from 'ish-core/facades/account.facade';
import { FeatureToggleModule } from 'ish-core/feature-toggle.module';

import { CamfilAccountNavigationComponent } from './camfil-account-navigation.component';
import { MockComponent } from 'ng-mocks';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

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
    }).compileComponents();

    when(accountFacadeMock.isBusinessCustomer$).thenReturn(of(true));
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
