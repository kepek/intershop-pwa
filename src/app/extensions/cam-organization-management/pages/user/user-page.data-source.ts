// tslint:disable: ish-ordered-imports project-structure
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, combineLatest } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';

import { CamOrganizationManagementFacade } from '../../facades/cam-organization-management.facade';
import { CamfilB2bCustomer } from '../../models/camfil-b2b-customer/camfil-b2b-customer.model';
import { CamfilB2bUser } from '../../models/camfil-b2b-user/camfil-b2b-user.model';
import { whenTruthy } from 'ish-core/utils/operators';

@Component({ template: '' })
// tslint:disable-next-line: component-creation-test
export abstract class UserPageDataSourceComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(private organizationFacade: CamOrganizationManagementFacade) {}

  private destroy$ = new Subject();

  customer$: Observable<CamfilB2bCustomer>;
  customerId$: Observable<string>;
  user$: Observable<CamfilB2bUser>;
  userId$: Observable<string>;
  selectedContext$: Observable<{ customer: CamfilB2bCustomer; user: CamfilB2bUser }>;

  // tslint:disable-next-line:no-empty
  ngOnInit() {
    this.customer$ = this.organizationFacade.selectedCustomer$.pipe(whenTruthy(), take(1));
    this.customerId$ = this.organizationFacade.selectedCustomerId$.pipe(whenTruthy(), take(1));

    this.user$ = this.organizationFacade.selectedUser$.pipe(whenTruthy(), take(1));
    this.userId$ = this.organizationFacade.selectedUserId$.pipe(whenTruthy(), take(1));

    this.selectedContext$ = combineLatest([this.customer$, this.user$]).pipe(
      map(([customer, user]) => ({ customer, user }))
    );
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

  selectedUser$() {
    return this.userId$.pipe(switchMap(userId => this.organizationFacade.getUser$(userId)));
  }

  selectedUserRoles$() {
    return this.userId$.pipe(switchMap(userId => this.organizationFacade.getUserRoles$(userId)));
  }

  selectedUserStaticRoles$() {
    return this.userId$.pipe(switchMap(userId => this.organizationFacade.getUserStaticRoles$(userId)));
  }

  selectedCustomer$() {
    return this.customerId$.pipe(switchMap(customerId => this.organizationFacade.getCustomer$(customerId)));
  }

  selectedCustomerRoles$() {
    return this.customerId$.pipe(switchMap(customerId => this.organizationFacade.getCustomerRoles$(customerId)));
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
    this.selectedContext$.pipe(take(1), whenTruthy()).subscribe(({ customer, user }) => {
      if (active) {
        this.organizationFacade.activateCustomerUser$(customer.id, user.id);
      } else {
        this.organizationFacade.deactivateCustomerUser$(customer.id, user.id);
      }
    });
  }

  onUpdateSelectedCustomerUserPassword() {
    this.selectedContext$.pipe(take(1), whenTruthy()).subscribe(({ customer, user }) => {
      const { login } = user;
      const customerId = customer?.id;
      const userId = user?.id;

      return this.organizationFacade.resetCustomerUserPassword(customerId, userId, login);
    });
  }

  onUpdateSelectedCustomerUserRoles({ roleIDs }) {
    this.selectedContext$.pipe(take(1), whenTruthy()).subscribe(({ customer, user }) => {
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
