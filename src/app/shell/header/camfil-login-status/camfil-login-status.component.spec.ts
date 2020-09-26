import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { User } from 'ish-core/models/user/user.model';

import { CamfilLoginStatusComponent } from './camfil-login-status.component';

describe('Camfil Login Status Component', () => {
  let component: CamfilLoginStatusComponent;
  let fixture: ComponentFixture<CamfilLoginStatusComponent>;
  let element: HTMLElement;
  let accountFacade: AccountFacade;

  const userData = {
    firstName: 'Patricia',
    lastName: 'Miller',
  } as User;

  beforeEach(async () => {
    accountFacade = mock(AccountFacade);
    await TestBed.configureTestingModule({
      declarations: [CamfilLoginStatusComponent, MockComponent(FaIconComponent)],
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      providers: [{ provide: AccountFacade, useFactory: () => instance(accountFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilLoginStatusComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render logout link if user is logged in', () => {
    when(accountFacade.user$).thenReturn(of(userData));
    fixture.detectChanges();

    expect(element.querySelector('a[data-testing-id=link-logout]')).toBeTruthy();
  });

  it('should not render logout link if user is not logged in', () => {
    fixture.detectChanges();

    expect(element.querySelector('a[data-testing-id=link-logout]')).toBeFalsy();
  });

  it('should render nothing on template when user is not logged in', () => {
    fixture.detectChanges();

    const loggedInDetails = element.getElementsByClassName('login-name');
    expect(loggedInDetails).toHaveLength(0);
  });
});
