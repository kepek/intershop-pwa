import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, combineLatest, forkJoin, of } from 'rxjs';
import { concatMap, map, switchMap, take } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { toObservable } from 'ish-core/utils/functions';
import { skipRelations, whenTruthy } from 'ish-core/utils/operators';

import { CamfilB2bContact } from '../models/camfil-b2b-contact/camfil-b2b-contact.model';
import {
  CamfilB2bCustomer,
  CamfilB2bCustomerContact,
  camfilB2bCustomerRelationsKeys,
} from '../models/camfil-b2b-customer/camfil-b2b-customer.model';
import { CamfilB2bOrganizationUser } from '../models/camfil-b2b-organization/camfil-b2b-organization.model';
import { CamfilB2bRole } from '../models/camfil-b2b-role/camfil-b2b-role.model';
import { CamfilB2bUser } from '../models/camfil-b2b-user/camfil-b2b-user.model';
import { getCamOrganizationManagementState } from '../store/cam-organization-management-store';
import { canHaveOnly1ParentCompany } from '../store/cam-organization-management-store.config';
import {
  getContacts,
  getContactsCount,
  getContactsError,
  getContactsLoading,
  isContactInitialized,
  loadCustomerContact,
  loadCustomerContacts,
  loadCustomerUserContact,
} from '../store/contact';
import {
  getCustomer,
  getCustomers,
  getCustomersCount,
  getCustomersError,
  getCustomersLoading,
  getSelectedCustomer,
  getSelectedCustomerId,
  isCustomerInitialized,
  loadCustomer,
  loadCustomers,
} from '../store/customer';
import {
  getContactByCustomerIdAndUserId,
  getContactsByCustomerId,
  getRolesByCustomerId,
  getRolesByUserId,
  getUserByCustomerId,
  getUsersByCustomerId,
} from '../store/organization';
import {
  getRole,
  getRoles,
  getRolesByIds,
  getRolesCount,
  getRolesError,
  getRolesLoading,
  isRoleInitialized,
  loadCustomerRoles,
  updateCustomerUserRoles,
} from '../store/role';
import {
  activateCustomerUser,
  connectContactWithUserAndCustomer,
  connectUserWithCustomer,
  createCustomerUser,
  deactivateCustomerUser,
  disconnectUserFromCustomer,
  getSelectedUser,
  getSelectedUserId,
  getUser,
  getUsers,
  getUsersCount,
  getUsersError,
  getUsersLoading,
  isUserInitialized,
  loadCustomerUser,
  loadCustomerUsers,
  resetCustomerUserPassword,
  updateCustomerUser,
} from '../store/user';

// tslint:disable:member-ordering
@Injectable({ providedIn: 'root' })
export class CamOrganizationManagementFacade {
  constructor(private store: Store, private accountFacade: AccountFacade) {}

  currentUser$ = this.accountFacade.user$.pipe(
    switchMap(currentUser => this.getUsers$().pipe(map(users => users.find(user => user.login === currentUser.login)))),
    whenTruthy(),
    take(1)
  );

  currentCustomer$ = this.accountFacade.customer$.pipe(
    switchMap(currentCustomer =>
      this.getCustomers$().pipe(
        map(customers => customers.find(customer => customer.customerNo === currentCustomer.customerNo))
      )
    ),
    whenTruthy(),
    take(1)
  );

  camOrganizationManagementState$ = this.store.pipe(select(getCamOrganizationManagementState));

  selectedCustomer$ = this.store.pipe(select(getSelectedCustomer));
  selectedCustomerId$ = this.store.pipe(select(getSelectedCustomerId));
  selectedUser$ = this.store.pipe(select(getSelectedUser));
  selectedUserId$ = this.store.pipe(select(getSelectedUserId));

  customersCount$ = this.store.pipe(select(getCustomersCount));
  customersError$ = this.store.pipe(select(getCustomersError));
  customersLoading$ = this.store.pipe(select(getCustomersLoading));
  customersInitialized$ = this.store.pipe(select(isCustomerInitialized));

  usersCount$ = this.store.pipe(select(getUsersCount));
  usersError$ = this.store.pipe(select(getUsersError));
  usersLoading$ = this.store.pipe(select(getUsersLoading));
  usersInitialized$ = this.store.pipe(select(isUserInitialized));

  contactsCount$ = this.store.pipe(select(getContactsCount));
  contactsError$ = this.store.pipe(select(getContactsError));
  contactsLoading$ = this.store.pipe(select(getContactsLoading));
  contactsInitialized$ = this.store.pipe(select(isContactInitialized));

  rolesCount$ = this.store.pipe(select(getRolesCount));
  rolesError$ = this.store.pipe(select(getRolesError));
  rolesLoading$ = this.store.pipe(select(getRolesLoading));
  rolesInitialized$ = this.store.pipe(select(isRoleInitialized));

  /**
   * Get Customers (sorted by parent company flag).
   */
  getCustomers$(): Observable<CamfilB2bCustomer[]> {
    return this.store.pipe(
      select(getCustomers),
      map(customers => [...customers].sort((x, y) => Number(x.parent) - Number(y.parent)).reverse())
    );
  }

  /**
   * Load Customers
   */
  loadCustomers$() {
    this.store.dispatch(loadCustomers());
  }

  /**
   * Customer
   */
  getCustomer$(customerId): Observable<CamfilB2bCustomer> {
    return this.store.pipe(select(getCustomer(customerId)));
  }

  /**
   * Load Customer
   * @param customerId
   */
  loadCustomer$(customerId) {
    this.store.dispatch(loadCustomer({ customerId }));
  }

  /**
   * Get Customer Users
   * @param customerId
   */
  getCustomerUsers$(customerId: string) {
    return this.store.pipe(select(getUsersByCustomerId(customerId)));
  }

  /**
   * Load Customer Users
   * @param customerId
   */
  loadCustomerUsers$(customerId: string) {
    this.store.dispatch(loadCustomerUsers({ customerId }));
  }

  /**
   * Get Customer Roles
   * @param customerIds
   */
  getCustomerRoles$(customerId: string): Observable<CamfilB2bRole[]> {
    return this.store.pipe(select(getRolesByCustomerId(customerId)));
  }

  /**
   * Get Customer Roles
   * @param userId
   */
  getUserRoles$(userId: string): Observable<CamfilB2bRole[]> {
    return this.store.pipe(select(getRolesByUserId(userId)));
  }

  /**
   * Get Static Roles
   * @param userId
   */
  getUserStaticRoles$(userId: string) {
    const disabledRoleIDs = ['APP_B2B_OCI_USER'];

    return this.isCurrentUser$(userId).pipe(
      switchMap(isCurrentUser =>
        isCurrentUser
          ? of([...disabledRoleIDs, 'APP_B2B_ACCOUNT_OWNER', 'APP_B2B_CUSTOMER_ADMIN_USER'])
          : of([...disabledRoleIDs])
      ),
      switchMap(roleIDs => this.getSelectedRoles$(roleIDs))
    );
  }

  getUserStaticCustomers$(userId: string): Observable<CamfilB2bCustomer[]> {
    return this.isCurrentUser$(userId).pipe(
      switchMap(isCurrentUser =>
        isCurrentUser
          ? this.getUser$(userId).pipe(map(user => user?.customers.filter(customer => customer?.parent)))
          : of([])
      )
    );
  }

  /**
   * Load Customer Roles
   * @param customerId
   */
  loadCustomerRoles$(customerId: string) {
    this.store.dispatch(loadCustomerRoles({ customerId }));
  }

  /**
   * Get Contacts
   */
  getContacts$(): Observable<CamfilB2bContact[]> {
    return this.store.pipe(select(getContacts));
  }

  /**
   * Get Customer Contacts
   * @param customerId
   */

  getCustomerContacts$(customerId: string): Observable<CamfilB2bContact[]> {
    return this.store.pipe(select(getContactsByCustomerId(customerId)));
  }

  /**
   * Load Customer Contacts
   * @param customerId
   */
  loadCustomerContacts$(customerId: string) {
    this.store.dispatch(loadCustomerContacts({ customerId }));
  }

  /**
   * Get Customer Contact
   * @param customerId
   * @param erpId
   */

  getCustomerContact$(customerId: string, erpId: string): Observable<CamfilB2bContact> {
    return this.store.pipe(
      select(getContactsByCustomerId(customerId)),
      map(contacts => contacts.find(c => c.erpId === erpId))
    );
  }

  /**
   * Load Customer Contacts
   * @param customerId
   * @param erpId
   */
  loadCustomerContact$(customerId: string, erpId: string) {
    this.store.dispatch(loadCustomerContact({ customerId, erpId }));
  }

  /**
   * Get Users
   */
  getUsers$(): Observable<CamfilB2bUser[]> {
    return this.store.pipe(select(getUsers));
  }

  /**
   * Load Customer Users
   */
  loadCustomersUsers$() {
    this.getCustomers$()
      .pipe(whenTruthy(), skipRelations(camfilB2bCustomerRelationsKeys))
      .subscribe(customers => {
        customers.forEach(customer => {
          if (canHaveOnly1ParentCompany) {
            // tslint:disable-next-line:no-unused-expression
            customer.parent && this.loadCustomerRoles$(customer.id);
          } else {
            this.loadCustomerRoles$(customer.id);
          }

          this.loadCustomerUsers$(customer.id);
        });
      });
  }

  /**
   * Get User
   * @param userId
   */
  getUser$(userId: string): Observable<CamfilB2bUser> {
    return this.store.pipe(select(getUser(userId)));
  }

  /**
   * Get User
   * @param customerId
   * @param userId
   */
  getCustomerUser$(customerId: string, userId: string): Observable<CamfilB2bUser> {
    return this.store.pipe(select(getUserByCustomerId(customerId, userId)));
  }

  /**
   * Load Users
   * @param customerId
   * @param userId
   */
  loadCustomerUser$(customerId: string, userId: string) {
    this.loadCustomer$(customerId);

    this.store.pipe(select(getCustomer(customerId)), whenTruthy(), take(1)).subscribe(customer => {
      this.loadCustomerRoles$(customer.id);
    });

    if (customerId && userId) {
      this.store.dispatch(loadCustomerUser({ customerId, userId }));
    }
  }

  /**
   * Is Current User?
   * @param userId
   */
  isCurrentUser$(userId: string): Observable<boolean> {
    const selectedUser$ = this.getUser$(userId).pipe(take(1));
    const currentUser$ = this.accountFacade.user$.pipe(take(1));

    return combineLatest([selectedUser$, currentUser$]).pipe(
      map(([selectedUser, currentUser]) => selectedUser?.login === currentUser?.login)
    );
  }

  /**
   * Get Customer User Contact
   * @param customerId
   * @param userId
   */
  getCustomerUserContact$(customerId: string, userId: string): Observable<CamfilB2bContact> {
    return this.store.pipe(select(getContactByCustomerIdAndUserId(customerId, userId)));
  }

  /**
   * Get Customer User Contacts
   * @param userId
   */
  // tslint:disable-next-line:no-unused
  getCustomersUserContacts$(
    userId: string
  ): Observable<({ contacts: CamfilB2bContact[]; selectedContact: CamfilB2bContact } & CamfilB2bCustomer)[]> {
    return this.getCustomers$().pipe(
      concatMap(customers =>
        forkJoin([
          ...customers.map(customer =>
            forkJoin([
              this.getCustomerContacts$(customer.id).pipe(take(1)),
              this.getCustomerUserContact$(customer.id, userId).pipe(take(1)),
            ]).pipe(
              map(([contacts, selectedContact]) => ({
                ...customer,
                contacts,
                selectedContact,
              }))
            )
          ),
        ])
      )
    );
  }

  /**
   * Load Customer User Contact
   * @param customerId
   * @param userId
   */
  loadCustomerUserContact$(customerId: string, userId: string) {
    this.store.dispatch(loadCustomerUserContact({ customerId, userId }));
  }

  /**
   * Activate User
   * @param customerId
   * @param userId
   */
  activateCustomerUser$(customerId, userId) {
    this.store.dispatch(activateCustomerUser({ customerId, userId }));
  }

  /**
   * Deactivate User
   * @param customerId
   * @param userId
   */
  deactivateCustomerUser$(customerId, userId) {
    this.store.dispatch(deactivateCustomerUser({ customerId, userId }));
  }

  /**
   * Activate User
   * @param customerId
   * @param userId
   */
  connectUserWithCustomer$(customerId: string, userId: string) {
    this.store.dispatch(connectUserWithCustomer({ customerId, userId }));
  }

  /**
   * Deactivate User
   * @param customerId
   * @param userId
   */
  disconnectUserFromCustomer$(customerId: string, userId: string) {
    this.store.dispatch(disconnectUserFromCustomer({ customerId, userId }));
  }

  /**
   * Activate User
   * @param customerId
   * @param userId
   * @param contact
   */
  connectContactWithUserAndCustomer$(customerId: string, userId: string, contact: CamfilB2bContact) {
    this.store.dispatch(connectContactWithUserAndCustomer({ customerId, userId, contact }));
  }

  getRoles$() {
    return this.store.pipe(select(getRoles));
  }

  /**s
   * Get Selected Roles
   * @param roleIDs
   */
  getSelectedRoles$(roleIDs: string[] | Observable<string[]>): Observable<CamfilB2bRole[]> {
    return toObservable(roleIDs).pipe(switchMap(ids => this.store.pipe(select(getRolesByIds(ids)))));
  }

  /**
   * Get Selected Role
   * @param roleID
   */
  getSelectedRole$(roleID: string | Observable<string>): Observable<CamfilB2bRole> {
    return toObservable(roleID).pipe(switchMap(id => this.store.pipe(select(getRole(id)))));
  }

  /**
   * Get Organization
   */
  getOrganizationUsers$(): Observable<CamfilB2bOrganizationUser[]> {
    return combineLatest([this.getUsers$(), this.getCustomers$()]).pipe(
      map(([users, customers]) =>
        users.map(user => ({
          ...user,
          customer: customers.find(c => c.id === user.customerId),
        }))
      )
    );
  }

  /**
   * Get Organization Loading
   */
  getOrganizationLoading$() {
    return combineLatest([this.customersLoading$, this.usersLoading$, this.contactsLoading$, this.rolesLoading$]).pipe(
      map(resources => resources.some(loading => loading))
    );
  }

  /**
   * Update Customer User
   * @param customer
   * @param user
   */
  updateCustomerUser$(customer: CamfilB2bCustomer, user: CamfilB2bUser) {
    this.store.dispatch(
      updateCustomerUser({
        customer,
        user,
      })
    );
  }

  /**
   * Update Customer User Roles
   *
   * @param customerId
   * @param userId
   * @param roleIDs
   */
  updateCustomerUserRoles$(customerId: string, userId: string, roleIDs: string[]) {
    this.store.dispatch(updateCustomerUserRoles({ customerId, userId, roleIDs }));
  }

  /**
   * Reset Customer User Password
   * @param customerId
   * @param userId
   * @param email
   */
  resetCustomerUserPassword(customerId: string, userId: string, login: string) {
    this.store.dispatch(resetCustomerUserPassword({ customerId, userId, login }));
  }

  /**
   * Create Customer User
   * @param customer
   * @param user
   * @param contacts
   * @param roles
   */
  createCustomerUser$(
    customer: CamfilB2bCustomer,
    user: CamfilB2bUser,
    contacts: CamfilB2bCustomerContact[],
    roles: CamfilB2bRole[]
  ) {
    this.store.dispatch(
      createCustomerUser({
        customer,
        user,
        contacts,
        roles,
      })
    );
  }
}
