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
import { CamfilErrorComponent } from 'ish-shared/components/common/camfil-error/camfil-error.component';
import { CamfilLoadingComponent } from 'ish-shared/components/common/camfil-loading/camfil-loading.component';

import { CamfilAccountDetailsFormComponent } from '../camfil-account-details-form/camfil-account-details-form.component';
import { CamfilAccountLanguageFormComponent } from '../camfil-account-language-form/camfil-account-language-form.component';
import { CamfilAccountPasswordFormComponent } from '../camfil-account-password-form/camfil-account-password-form.component';

import { CamfilAccountProfileComponent } from './camfil-account-profile.component';

describe('Camfil Account Profile Component', () => {
  let component: CamfilAccountProfileComponent;
  let fixture: ComponentFixture<CamfilAccountProfileComponent>;
  let element: HTMLElement;

  const user = { firstName: 'Patricia', lastName: 'Miller', email: 'patricia@test.intershop.de' } as User;
  const customer = { isBusinessCustomer: false } as Customer;

  beforeEach(async () => {
    const accountFacade = mock(AccountFacade);
    when(accountFacade.user$).thenReturn(of(user));
    when(accountFacade.customer$).thenReturn(of(customer));

    await TestBed.configureTestingModule({
      declarations: [
        CamfilAccountDetailsFormComponent,
        CamfilAccountLanguageFormComponent,
        CamfilAccountPasswordFormComponent,
        CamfilAccountProfileComponent,
        CamfilErrorComponent,
        MockComponent(CamfilLoadingComponent),
        MockComponent(FaIconComponent),
        MockDirective(ServerHtmlDirective),
        MockPipe(DatePipe),
      ],
      imports: [TranslateModule.forRoot()],
      providers: [{ provide: AccountFacade, useFactory: () => instance(accountFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilAccountProfileComponent);
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
    expect(element.querySelector('camfil-account-details-form')).toBeTruthy();
    expect(element.querySelector('camfil-account-password-form')).toBeTruthy();
  });
});
