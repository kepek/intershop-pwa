// tslint:disable: ish-ordered-imports project-structure
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, combineLatest, BehaviorSubject } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';

import { CamOrganizationManagementFacade } from '../../facades/cam-organization-management.facade';
import { CamfilB2bCustomer } from '../../models/camfil-b2b-customer/camfil-b2b-customer.model';
import { CamfilB2bUser } from '../../models/camfil-b2b-user/camfil-b2b-user.model';
import { whenTruthy } from 'ish-core/utils/operators';

@Component({ template: '' })
// tslint:disable-next-line: component-creation-test
export abstract class CreatePageDataSourceComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(private organizationFacade: CamOrganizationManagementFacade) {}

  private destroy$ = new Subject();

  customer$: Observable<Partial<CamfilB2bCustomer>>;
  customerId$: Observable<string>;
  user$: Observable<Partial<CamfilB2bUser>>;
  userId$: Observable<string>;
  context$: Observable<{ customer: Partial<CamfilB2bCustomer>; user: Partial<CamfilB2bUser> }>;

  // tslint:disable-next-line:no-empty
  ngOnInit() {
    this.customer$ = this.organizationFacade.currentCustomer$;
    this.customerId$ = this.customer$.pipe(map(customer => customer.id));

    this.user$ = new BehaviorSubject<Partial<CamfilB2bUser>>({});
    this.userId$ = this.user$.pipe(map(user => user.id));

    this.context$ = combineLatest([this.customer$, this.user$]).pipe(map(([customer, user]) => ({ customer, user })));
  }

  // tslint:disable-next-line:no-empty
  ngAfterViewInit() {}

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loading$() {
    return this.organizationFacade.getOrganizationLoading$();
  }

  newUser$() {
    return this.userId$.pipe(switchMap(userId => this.organizationFacade.getUser$(userId)));
  }

  newUserRoles$() {
    return combineLatest([
      this.userId$.pipe(switchMap(userId => this.organizationFacade.getUserRoles$(userId))),
      this.organizationFacade.getSelectedRoles$(['APP_B2B_BUYER']),
    ]).pipe(map(([userRoles, newUserRoles]) => [...userRoles, ...newUserRoles]));
  }

  newUserStaticRoles$() {
    return this.userId$.pipe(switchMap(userId => this.organizationFacade.getUserStaticRoles$(userId)));
  }

  selectedCustomer$() {
    return this.customerId$.pipe(switchMap(customerId => this.organizationFacade.getCustomer$(customerId)));
  }

  selectedCustomerRoles$() {
    return this.customerId$.pipe(switchMap(customerId => this.organizationFacade.getCustomerRoles$(customerId)));
  }

  roles$() {
    return this.organizationFacade.getRoles$();
  }

  customers$() {
    return this.organizationFacade.getCustomers$();
  }

  customerContacts$(customerId: string) {
    return this.organizationFacade.getCustomerContacts$(customerId);
  }

  customerUserContact$(customerId) {
    return this.userId$.pipe(switchMap(userId => this.organizationFacade.getCustomerUserContact$(customerId, userId)));
  }

  onUpdateSelectedCustomerUserActive({ active }) {
    // TODO (extMlk): This one suppose to be do the job but then the changes are not reflected in Camfil Customers API endpoints;
    // tslint:disable-next-line:no-commented-out-code
    // this.organizationFacade.updateCustomerUser$(customer, { ...user, active });
    this.context$.pipe(take(1), whenTruthy()).subscribe(({ customer, user }) => {
      if (active) {
        this.organizationFacade.activateCustomerUser$(customer.id, user.id);
      } else {
        this.organizationFacade.deactivateCustomerUser$(customer.id, user.id);
      }
    });
  }

  onUpdateSelectedCustomerUserPassword() {
    this.context$.pipe(take(1), whenTruthy()).subscribe(({ customer, user }) => {
      const { email } = user;
      const customerId = customer?.id;
      const userId = user?.id;

      return this.organizationFacade.resetCustomerUserPassword(customerId, userId, email);
    });
  }

  onUpdateSelectedCustomerUserRoles({ roleIDs }) {
    this.context$.pipe(take(1), whenTruthy()).subscribe(({ customer, user }) => {
      this.organizationFacade.updateCustomerUserRoles$(customer.id, user.id, roleIDs);
    });
  }

  onUpdateSelectedCustomerUserDetails({ customer, user }) {
    this.organizationFacade.updateCustomerUser$(customer, user);
  }

  onAssignCustomerUserContact({ customer, user, contact }) {
    this.organizationFacade.assignCustomerUserContact$(customer.id, user.id, contact);
  }

  onUnassignCustomerUserContact({ customer, user, contact }) {
    this.organizationFacade.unassignCustomerUserContact$(customer.id, user.id, contact);
  }
}
