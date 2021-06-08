import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';

import { CamfilB2bCustomer } from '../../models/camfil-b2b-customer/camfil-b2b-customer.model';

import { CamfilOrganizationUserDetailsFormComponent } from './camfil-organization-user-details-form.component';

describe('Camfil Organization User Details Form Component', () => {
  let component: CamfilOrganizationUserDetailsFormComponent;
  let fixture: ComponentFixture<CamfilOrganizationUserDetailsFormComponent>;
  let element: HTMLElement;
  let accountFacade: AccountFacade;

  beforeEach(async () => {
    accountFacade = mock(AccountFacade);

    await TestBed.configureTestingModule({
      declarations: [CamfilOrganizationUserDetailsFormComponent],
      providers: [{ provide: AccountFacade, useFactory: () => instance(accountFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilOrganizationUserDetailsFormComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    const user = {
      id: 'test',
    } as CamfilB2bCustomer;
    when(accountFacade.customer$).thenReturn(of(user));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
