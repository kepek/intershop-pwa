// tslint:disable: ish-ordered-imports project-structure rxjs-no-subject-value
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, combineLatest, BehaviorSubject, throwError } from 'rxjs';
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

  onUpdateNewCustomerUser({ user }) {
    user.active = user.active || true;

    this.newUser$.next(user);
  }

  onUpdateSelectedCustomerUserRoles({ roleIDs }) {
    this.organizationFacade
      .getSelectedRoles$(roleIDs)
      .pipe(
        filter(r => r.length !== 0),
        distinctUntilChanged()
      )
      .subscribe(roles => this.newUserRoles$.next(roles));
  }

  onAssignCustomerUserContact(event: { customer: CamfilB2bCustomer; user: CamfilB2bUser; contact: CamfilB2bContact }) {
    const { customer, contact } = event;

    const assignment: CamfilB2bCustomerContact = { customer, contact };
    const newAssignments = [...this.newUserContacts$.getValue(), assignment];

    this.newUserContacts$.next(newAssignments);
  }

  onUnassignCustomerUserContact(event: {
    customer: CamfilB2bCustomer;
    user: CamfilB2bUser;
    contact: CamfilB2bContact;
  }) {
    const newCustomer = event?.customer;
    const newContact = event?.contact;

    const newAssignments = [
      ...this.newUserContacts$
        .getValue()
        .filter(({ customer, contact }) => newCustomer.id !== customer.id && newContact.erpId !== contact.erpId),
    ];

    this.newUserContacts$.next(newAssignments);
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
