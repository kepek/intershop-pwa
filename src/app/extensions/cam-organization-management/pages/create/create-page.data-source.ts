// tslint:disable: ish-ordered-imports project-structure rxjs-no-subject-value
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, combineLatest, throwError, BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';

import { CamOrganizationManagementFacade } from '../../facades/cam-organization-management.facade';
import {
  CamfilB2bCustomer,
  CamfilB2bCustomerContact,
} from '../../models/camfil-b2b-customer/camfil-b2b-customer.model';
import { CamfilB2bUser } from '../../models/camfil-b2b-user/camfil-b2b-user.model';
import { CamfilB2bRole } from '../../models/camfil-b2b-role/camfil-b2b-role.model';
import { CamfilB2bContact } from '../../models/camfil-b2b-contact/camfil-b2b-contact.model';

@Component({ template: '' })
// tslint:disable-next-line: component-creation-test
export abstract class CreatePageDataSourceComponent implements OnInit, OnDestroy {
  constructor(protected organizationFacade: CamOrganizationManagementFacade) {}

  // tslint:disable-next-line:private-destroy-field
  protected destroy$ = new Subject();

  currentCustomer$: Observable<CamfilB2bCustomer>;
  currentCustomerId$: Observable<string>;

  newUser$: BehaviorSubject<CamfilB2bUser>;
  newUserId$: Observable<string>;
  newUserCustomer$: Observable<CamfilB2bCustomer>;
  newUserContacts$: BehaviorSubject<CamfilB2bCustomerContact[]>;
  newUserRoles$: BehaviorSubject<CamfilB2bRole[]>;
  newUserStaticRoles$: Observable<CamfilB2bRole[]>;

  context$: Observable<{
    customer: CamfilB2bCustomer;
    user: CamfilB2bUser;
    contacts: CamfilB2bCustomerContact[];
    roles: CamfilB2bRole[];
  }>;

  // Methods

  static createLogin(customer: CamfilB2bCustomer, user: CamfilB2bUser) {
    if (!user) {
      return throwError('createLogin() called without required user data');
    }

    if (!customer) {
      return throwError('createLogin() called without required customer data');
    }

    return `${user.email.split('@')[0]}-${customer.customerNo}`;
  }

  // Hooks

  ngOnInit() {
    this.currentCustomer$ = this.organizationFacade.currentCustomer$;
    this.currentCustomerId$ = this.currentCustomer$.pipe(map(customer => customer.id));

    this.newUser$ = new BehaviorSubject<CamfilB2bUser>({ id: undefined });
    this.newUserId$ = this.newUser$.pipe(map(user => user.id));
    this.newUserCustomer$ = this.currentCustomerId$.pipe(
      switchMap(customerId => this.organizationFacade.getCustomer$(customerId))
    );
    this.newUserContacts$ = new BehaviorSubject<CamfilB2bCustomerContact[]>([]);
    this.newUserRoles$ = new BehaviorSubject<CamfilB2bRole[]>([]);
    this.newUserStaticRoles$ = this.newUserId$.pipe(
      switchMap(userId => this.organizationFacade.getUserStaticRoles$(userId))
    );

    this.organizationFacade
      .getSelectedRoles$(['APP_B2B_BUYER'])
      .pipe(filter(r => r.length !== 0))
      .subscribe(newUserRoles => {
        this.newUserRoles$.next(newUserRoles);
      });

    this.context$ = combineLatest([
      this.currentCustomer$,
      this.newUser$,
      this.newUserContacts$,
      this.newUserRoles$,
    ]).pipe(map(([customer, user, contacts, roles]) => ({ customer, user, contacts, roles })));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Handlers

  onUpdateNewCustomerUser(event: { customer: CamfilB2bCustomer; user: CamfilB2bUser }) {
    const newUser = event?.user;

    newUser.active = newUser.active || true;

    this.newUser$.next({ ...newUser });
  }

  onUpdateSelectedCustomerUserRoles(event: { roleIDs: string[] }) {
    const newRoleIDs = event?.roleIDs;

    this.organizationFacade
      .getSelectedRoles$(newRoleIDs)
      .pipe(
        filter(r => r.length !== 0),
        distinctUntilChanged()
      )
      .subscribe(roles => this.newUserRoles$.next(roles));
  }

  onConnectUserWithCustomer(event: { customer: CamfilB2bCustomer; user: CamfilB2bUser }) {
    const newCustomer = event?.customer;
    const newUser = event?.user;

    newUser.customers = newUser.customers || [];
    newUser.customers = [...newUser?.customers, newCustomer];

    this.newUser$.next({ ...newUser });
  }

  onDisconnectUserFromCustomer(event: { customer: CamfilB2bCustomer; user: CamfilB2bUser }) {
    const newCustomer = event?.customer;
    const newUser = event?.user;

    if (newUser?.customers) {
      newUser.customers = [...newUser.customers.filter(c => c.id !== newCustomer?.id)];
    }

    this.newUser$.next({ ...newUser });
  }

  onConnectContactWithUserAndCustomer(event: {
    customer: CamfilB2bCustomer;
    user: CamfilB2bUser;
    contact: CamfilB2bContact;
  }) {
    const newCustomer = event?.customer;
    const newUser = event?.user;
    const newContact = event?.contact;

    const connection: CamfilB2bCustomerContact = { customer: newCustomer, contact: newContact };
    const connections = [...this.newUserContacts$.getValue(), connection];

    this.newUserContacts$.next(connections);

    const updatedCustomer = { ...newCustomer, userContact: newContact };

    newUser.customers = newUser.customers || [];
    newUser.customers = [...newUser?.customers?.filter(c => c.id !== updatedCustomer.id), updatedCustomer];

    this.newUser$.next({ ...newUser });
  }

  onDisconnectContactFromUserAndCustomer(event: {
    customer: CamfilB2bCustomer;
    user: CamfilB2bUser;
    contact: CamfilB2bContact;
  }) {
    const newCustomer = event?.customer;
    const newUser = event?.user;
    const newContact = event?.contact;

    const connections = [
      ...this.newUserContacts$
        .getValue()
        .filter(({ customer, contact }) => newCustomer.id !== customer.id && newContact.erpId !== contact.erpId),
    ];

    this.newUserContacts$.next(connections);

    const updatedCustomer = { ...newCustomer, userContact: undefined };

    newUser.customers = newUser.customers || [];
    newUser.customers = [...newUser?.customers?.filter(c => c.id !== updatedCustomer.id), updatedCustomer];

    this.newUser$.next({ ...newUser });
  }

  // Observables

  loading$() {
    return this.organizationFacade.getOrganizationLoading$();
  }

  customers$() {
    return this.organizationFacade.getCustomers$();
  }

  customerContacts$(customerId: string) {
    return this.organizationFacade.getCustomerContacts$(customerId);
  }

  customerUserContact$(customerId: string) {
    return this.newUserId$.pipe(
      switchMap(userId => this.organizationFacade.getCustomerUserContact$(customerId, userId))
    );
  }

  roles$() {
    return this.organizationFacade.getRoles$();
  }
}
