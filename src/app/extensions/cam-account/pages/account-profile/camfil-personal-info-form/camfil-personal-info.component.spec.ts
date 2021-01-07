import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { Customer } from 'ish-core/models/customer/customer.model';
import { User } from 'ish-core/models/user/user.model';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { CamfilPersonalInfoComponent } from './camfil-personal-info.component';

describe('Camfil Personal Info Component', () => {
  let component: CamfilPersonalInfoComponent;
  let fixture: ComponentFixture<CamfilPersonalInfoComponent>;
  let element: HTMLElement;

  const customer = {
    customerNo: 'Patricia',
    isBusinessCustomer: false,
  } as Customer;

  const user = {
    firstName: 'Patricia',
    lastName: 'Miller',
    title: '',
  } as User;

  beforeEach(async () => {
    const accountFacade = mock(AccountFacade);
    when(accountFacade.user$).thenReturn(of(user));
    when(accountFacade.customer$).thenReturn(of(customer));

    await TestBed.configureTestingModule({
      declarations: [CamfilPersonalInfoComponent, MockComponent(LoadingComponent)],
      providers: [{ provide: AccountFacade, useFactory: () => instance(accountFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilPersonalInfoComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
