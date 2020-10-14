import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective, MockPipe } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { AccountFacade } from 'ish-core/facades/account.facade';
import { Customer } from 'ish-core/models/customer/customer.model';
import { User } from 'ish-core/models/user/user.model';
import { DatePipe } from 'ish-core/pipes/date.pipe';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { ChangePasswordComponent } from '../change-password/change-password.component';
import { PersonalInfoComponent } from '../personal-info-form/personal-info.component';

import { AccountProfileComponent } from './account-profile.component';

describe('Account Profile Component', () => {
  let component: AccountProfileComponent;
  let fixture: ComponentFixture<AccountProfileComponent>;
  let element: HTMLElement;

  const user = { firstName: 'Patricia', lastName: 'Miller', email: 'patricia@test.intershop.de' } as User;
  const customer = { isBusinessCustomer: false } as Customer;

  beforeEach(async () => {
    const accountFacade = mock(AccountFacade);
    when(accountFacade.user$).thenReturn(of(user));
    when(accountFacade.customer$).thenReturn(of(customer));

    await TestBed.configureTestingModule({
      declarations: [
        AccountProfileComponent,
        ChangePasswordComponent,
        MockComponent(FaIconComponent),
        MockComponent(LoadingComponent),
        MockDirective(ServerHtmlDirective),
        MockPipe(DatePipe),
        PersonalInfoComponent,
      ],
      imports: [TranslateModule.forRoot()],
      providers: [{ provide: AccountFacade, useFactory: () => instance(accountFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountProfileComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.user = user;
    component.customer = customer;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display customer data and edit links after creation ', () => {
    fixture.detectChanges();
    expect(element.querySelector('camfil-account-personal-info-form')).toBeTruthy();
    expect(element.querySelector('camfil-account-change-password-form')).toBeTruthy();
  });
});
