import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { pick } from 'lodash-es';
import { EMPTY, Observable, forkJoin, of, throwError } from 'rxjs';
import { catchError, concatAll, concatMap, defaultIfEmpty, map, switchMap, withLatestFrom } from 'rxjs/operators';

import { AppFacade } from 'ish-core/facades/app.facade';
import { AddressData } from 'ish-core/models/address/address.interface';
import { AddressMapper } from 'ish-core/models/address/address.mapper';
import { Address } from 'ish-core/models/address/address.model';
import { PasswordReminder } from 'ish-core/models/password-reminder/password-reminder.model';
import { ApiService, AvailableOptions, unpackEnvelope } from 'ish-core/services/api/api.service';
import { whenTruthy } from 'ish-core/utils/operators';

import { CamCardData } from '../../../cam-cards/models/cam-card/cam-card.interface';
import { CamCardMapper } from '../../../cam-cards/models/cam-card/cam-card.mapper';
import { CamCard } from '../../../cam-cards/models/cam-card/cam-card.model';
import { CamOrganizationManagementFacade } from '../../facades/cam-organization-management.facade';
import { CamfilB2bContactData } from '../../models/camfil-b2b-contact/camfil-b2b-contact.interface';
import { CamfilB2bContactMapper } from '../../models/camfil-b2b-contact/camfil-b2b-contact.mapper';
import { CamfilB2bContact } from '../../models/camfil-b2b-contact/camfil-b2b-contact.model';
import { CamfilB2bCustomerData } from '../../models/camfil-b2b-customer/camfil-b2b-customer.interface';
import { CamfilB2bCustomerMapper } from '../../models/camfil-b2b-customer/camfil-b2b-customer.mapper';
import {
  CamfilB2bCustomer,
  CamfilB2bCustomerContact,
} from '../../models/camfil-b2b-customer/camfil-b2b-customer.model';
import { CamfilB2bRoleData, CamfilB2bRoleIDsData } from '../../models/camfil-b2b-role/camfil-b2b-role.interface';
import { CamfilB2bRoleMapper } from '../../models/camfil-b2b-role/camfil-b2b-role.mapper';
import { CamfilB2bRole } from '../../models/camfil-b2b-role/camfil-b2b-role.model';
import { CamfilB2bUserData } from '../../models/camfil-b2b-user/camfil-b2b-user.interface';
import { CamfilB2bUserMapper } from '../../models/camfil-b2b-user/camfil-b2b-user.mapper';
import { CamfilB2bUser } from '../../models/camfil-b2b-user/camfil-b2b-user.model';

@Injectable({ providedIn: 'root' })
export class CamOrganizationService {
  constructor(
    private apiService: ApiService,
    private b2bRoleMapper: CamfilB2bRoleMapper,
    private camCardMapper: CamCardMapper,
    private appFacade: AppFacade,
    private organizationFacade: CamOrganizationManagementFacade
  ) {}

  getCustomers(): Observable<CamfilB2bCustomer[]> {
    return this.apiService
      .get<CamfilB2bCustomerData[]>(`camfilcustomers`)
      .pipe(unpackEnvelope(), map(CamfilB2bCustomerMapper.fromListData), defaultIfEmpty([]));
  }

  // Customer

  getCustomer(customerId: string): Observable<CamfilB2bCustomer> {
    return this.apiService
      .get<CamfilB2bCustomerData>(`camfilcustomers/${customerId}`)
      .pipe(map(CamfilB2bCustomerMapper.fromData));
  }

  // Customer -> Delivery Addresses

  getCustomerDeliveryAddresses(customerId: string): Observable<Address[]> {
    return this.apiService.get<AddressData[]>(`camfilcustomers/${customerId}/deliveryaddresses`).pipe(
      unpackEnvelope(),
      map(deliverAddresses => deliverAddresses.map(AddressMapper.fromData), defaultIfEmpty([]))
    );
  }

  createCustomerDeliveryAddress(customerId: string, address: Address): Observable<Address> {
    return this.apiService
      .post<AddressData>(`camfilcustomers/${customerId}/deliveryaddresses`, address)
      .pipe(map(AddressMapper.fromData));
  }

  getCustomerDeliveryAddress(customerId: string, addressId: string): Observable<Address> {
    return this.apiService
      .get<AddressData>(`camfilcustomers/${customerId}/deliveryaddresses/${addressId}`)
      .pipe(map(AddressMapper.fromData));
  }

  updateCustomerDeliveryAddress(customerId: string, addressId: string): Observable<Address> {
    return this.apiService
      .put<AddressData>(`camfilcustomers/${customerId}/deliveryaddresses/${addressId}`)
      .pipe(map(AddressMapper.fromData));
  }

  // Customer -> Roles

  getCustomerRoles(customerId: string): Observable<CamfilB2bRole[]> {
    return this.apiService.get(`camfilcustomers/${customerId}/roles`).pipe(
      unpackEnvelope<CamfilB2bRoleData>('userRoles'),
      map(data => this.b2bRoleMapper.fromData(data), defaultIfEmpty([]))
    );
  }

  // Customer -> CamCards

  getCustomerCamCards(customerId: string): Observable<CamCard[]> {
    return this.apiService
      .get<CamCardData[]>(`privatecamfilcustomers/${customerId}/camcards`)
      .pipe(unpackEnvelope<CamCardData>(), map(this.camCardMapper.fromListData), defaultIfEmpty([]));
  }

  // Customer -> Contacts

  getCustomerContacts(customerId: string): Observable<CamfilB2bContact[]> {
    return this.apiService
      .get<CamfilB2bContactData[]>(`privatecamfilcustomers/${customerId}/contacts`)
      .pipe(unpackEnvelope(), map(CamfilB2bContactMapper.fromListData), defaultIfEmpty([]));
  }

  // Customer -> Contact

  getCustomerContact(customerId: string, erpId: string): Observable<CamfilB2bContact> {
    return this.apiService
      .get<CamfilB2bContactData>(`privatecamfilcustomers/${customerId}/contacts/${erpId}`)
      .pipe(map(CamfilB2bContactMapper.fromData));
  }

  createCustomerContact(customerId: string, contact: CamfilB2bContact): Observable<CamfilB2bContact> {
    return this.apiService
      .post<CamfilB2bContactData>(`privatecamfilcustomers/${customerId}/contacts`, contact)
      .pipe(map(CamfilB2bContactMapper.fromData));
  }

  updateCustomerContact(customerId: string, erpId: string, contact: CamfilB2bContact): Observable<CamfilB2bContact> {
    return this.apiService
      .put<CamfilB2bContactData>(`privatecamfilcustomers/${customerId}/contacts/${erpId}`, contact)
      .pipe(map(CamfilB2bContactMapper.fromData));
  }

  deleteCustomerContact(customerId: string, erpId: string) {
    return this.apiService.delete<void>(`privatecamfilcustomers/${customerId}/contacts/${erpId}`);
  }

  getCustomerUsers(customerId: string): Observable<CamfilB2bUser[]> {
    return this.apiService
      .get<CamfilB2bUserData>(`privatecamfilcustomers/${customerId}/users`)
      .pipe(unpackEnvelope(), map(CamfilB2bUserMapper.fromListData), defaultIfEmpty([]));
  }

  // Customer -> User

  getCustomerUser(customerId: string, userId: string): Observable<CamfilB2bUser> {
    return this.apiService
      .get<CamfilB2bUserData>(`privatecamfilcustomers/${customerId}/users/${userId}`)
      .pipe(map(CamfilB2bUserMapper.fromData));
  }

  // Customer -> User -> Update

  updateCustomerUser(customer: CamfilB2bCustomer, user: CamfilB2bUser) {
    if (!customer) {
      return throwError('updateCustomerUser() called without required customer data');
    }

    if (!user) {
      return throwError('updateCustomerUser() called without required user data');
    }

    // TODO (extMlk): See CAM-979
    const login = user?.currentLogin || user.login;

    return this.apiService
      .put(`customers/${customer.customerNo}/users/${login}`, {
        ...customer,
        ...user,
        preferredInvoiceToAddress: { urn: user.preferredInvoiceToAddressUrn },
        preferredShipToAddress: { urn: user.preferredShipToAddressUrn },
        preferredPaymentInstrument: { id: user.preferredPaymentInstrumentId },
        preferredInvoiceToAddressUrn: undefined,
        preferredShipToAddressUrn: undefined,
        preferredPaymentInstrumentId: undefined,
      })
      .pipe(map(CamfilB2bUserMapper.fromData));
  }

  // Customer -> User -> Create

  createCustomerUser(
    customer: CamfilB2bCustomer,
    user: CamfilB2bUser,
    contacts: CamfilB2bCustomerContact[],
    roles: CamfilB2bRole[]
  ) {
    const roleIDs = [].concat(roles).map(r => r?.id);

    if (!customer) {
      return throwError('createCustomerUser() called without required customer data');
    }

    if (!user) {
      return throwError('createCustomerUser() called without required user data');
    }

    return this.appFacade.currentLocale$.pipe(
      switchMap(currentLocale =>
        this.apiService
          .post<CamfilB2bUser>(`customers/${customer.customerNo}/users`, {
            elements: [
              {
                ...customer,
                ...user,
                preferredInvoiceToAddress: { urn: user.preferredInvoiceToAddressUrn },
                preferredShipToAddress: { urn: user.preferredShipToAddressUrn },
                preferredPaymentInstrument: { id: user.preferredPaymentInstrumentId },
                preferredInvoiceToAddressUrn: undefined,
                preferredShipToAddressUrn: undefined,
                preferredPaymentInstrumentId: undefined,
                preferredLanguage: currentLocale.lang ?? 'en_US',
                userBudgets: undefined,
                roleIds: undefined,
              },
            ],
          })
          .pipe(
            concatMap(() =>
              this.getCustomerUsers(customer.id).pipe(map(users => users.find(u => u.login === user.login)))
            )
          )
          .pipe(
            switchMap(createdUser =>
              forkJoin(
                contacts.map(item =>
                  this.connectUserWithCustomer(item.customer.id, createdUser.id).pipe(catchError(() => EMPTY))
                )
              ).pipe(
                defaultIfEmpty([]),
                map(() => createdUser)
              )
            ),
            switchMap(createdUser =>
              forkJoin(
                contacts.map(item =>
                  this.connectContactWithUserCustomer(item.customer.id, createdUser.id, item.contact).pipe(
                    catchError(() => EMPTY)
                  )
                )
              ).pipe(
                defaultIfEmpty([]),
                map(() => createdUser)
              )
            ),
            switchMap(createdUser =>
              this.updateCustomerUserRoles(customer.id, createdUser.id, roleIDs).pipe(
                map(() => createdUser),
                catchError(() => EMPTY)
              )
            ),
            switchMap(createdUser => this.getCustomerUser(customer.id, createdUser.id))
          )
      )
    );
  }

  // Customer -> User -> Active Flag

  updateCustomerUserActiveFlag(customerId: string, userId: string, value: boolean): Observable<boolean> {
    const options: AvailableOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'text/plain',
        Accept: 'application/json',
      }),
    };

    // TODO (extMlk): This need to be fixed on Back-end. Endpoint does not return any response.

    return this.apiService
      .post<string>(`privatecamfilcustomers/${customerId}/users/${userId}/activeFlag`, value, options)
      .pipe(map(() => value));
  }

  // Customer -> User -> Contact

  getCustomerUserContact(customerId: string, userId: string): Observable<CamfilB2bContact> {
    return this.apiService
      .get<CamfilB2bContactData>(`privatecamfilcustomers/${customerId}/users/${userId}/contact`)
      .pipe(map(CamfilB2bContactMapper.fromData));
  }

  // Customer -> User -> Connect

  connectUserWithCustomer(customerId: string, userId: string): Observable<boolean> {
    const body = true;

    const options: AvailableOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'text/plain',
        Accept: 'application/json',
      }),
    };

    return this.apiService
      .post<void>(`camfilcustomers/${customerId}/users/${userId}/grantRevoke`, body, options)
      .pipe(map(() => body));
  }

  connectUserWithCustomerPlusReload(customerId: string, userId: string): Observable<CamfilB2bUser> {
    return this.connectUserWithCustomer(customerId, userId).pipe(
      withLatestFrom(this.organizationFacade.getUser$(userId).pipe(whenTruthy())),
      concatMap(([, user]) => this.getCustomerUser(user.customerId, userId))
    );
  }

  // Customer -> User -> Disconnect

  disconnectUserFromCustomer(customerId: string, userId: string): Observable<boolean> {
    const body = false;

    const options: AvailableOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'text/plain',
        Accept: 'application/json',
      }),
    };

    return this.apiService
      .post<void>(`camfilcustomers/${customerId}/users/${userId}/grantRevoke`, body, options)
      .pipe(map(() => body));
  }

  disconnectUserFromCustomerPlusReload(customerId: string, userId: string): Observable<CamfilB2bUser> {
    return this.disconnectUserFromCustomer(customerId, userId).pipe(
      withLatestFrom(this.organizationFacade.getUser$(userId).pipe(whenTruthy())),
      concatMap(([, user]) => this.getCustomerUser(user.customerId, userId))
    );
  }

  // Customer -> User -> Contact -> Connect

  connectContactWithUserCustomer(
    customerId: string,
    userId: string,
    contact: CamfilB2bContact
  ): Observable<CamfilB2bContact> {
    const body = contact;

    return this.apiService
      .post<CamfilB2bContactData>(`privatecamfilcustomers/${customerId}/users/${userId}/contact`, body)
      .pipe(map(() => body));
  }

  connectContactWithUserCustomerPlusReload(
    customerId: string,
    userId: string,
    contact: CamfilB2bContact
  ): Observable<CamfilB2bUser> {
    return this.connectContactWithUserCustomer(customerId, userId, contact).pipe(
      withLatestFrom(this.organizationFacade.getUser$(userId).pipe(whenTruthy())),
      concatMap(([, user]) => this.getCustomerUser(user.customerId, userId))
    );
  }

  // Customer -> User -> Contact -> Disconnect

  disconnectContactWithUserCustomer(
    customerId: string,
    userId: string,
    contact: CamfilB2bContact
  ): Observable<CamfilB2bContact> {
    const body = contact;

    return this.apiService
      .delete<CamfilB2bContactData>(`privatecamfilcustomers/${customerId}/users/${userId}/contact/${contact.erpId}`)
      .pipe(map(() => body));
  }

  disconnectContactFromUserAndCustomerPlusReload(
    customerId: string,
    userId: string,
    contact: CamfilB2bContact
  ): Observable<CamfilB2bUser> {
    return this.disconnectContactWithUserCustomer(customerId, userId, contact).pipe(
      withLatestFrom(this.organizationFacade.getUser$(userId).pipe(whenTruthy())),
      concatMap(([, user]) => this.getCustomerUser(user.customerId, userId))
    );
  }

  // Customer -> User -> Roles

  getCustomerUserRoles(customerId: string, userId: string): Observable<CamfilB2bRole[]> {
    return this.apiService.get<CamfilB2bRoleData>(`privatecamfilcustomers/${customerId}/users/${userId}/role`).pipe(
      unpackEnvelope<CamfilB2bRoleData>('userRoles'),
      map(data => this.b2bRoleMapper.fromData(data)),
      defaultIfEmpty([])
    );
  }

  // Customer -> User -> Roles -> Update

  updateCustomerUserRoles(customerId: string, userId: string, roleIDs: string[]): Observable<CamfilB2bRole[]> {
    const body: CamfilB2bRoleIDsData = { userRoles: roleIDs };

    return this.apiService
      .put<CamfilB2bRoleIDsData>(`privatecamfilcustomers/${customerId}/users/${userId}/role`, body)
      .pipe(
        unpackEnvelope<CamfilB2bRoleData>('userRoles'),
        map(data => this.b2bRoleMapper.fromData(data))
      );
  }

  // Customer -> User -> Reset Password

  resetCustomerUserPassword(customerId: string, userId: string, login: string) {
    const data: PasswordReminder = {
      email: login, // Camfil uses `login` instead of email address to recognize user.
    };

    const options: AvailableOptions = {
      skipApiErrorHandling: true,
      captcha: pick(data, ['captcha', 'captchaAction']),
    };

    const body = { answer: '', ...data };

    return this.apiService.post('security/reminder', body, options).pipe(
      map(() => ({
        customerId,
        userId,
        login,
        data,
      }))
    );
  }

  // Organization -> Users

  getOrganizationUsers(customerIDs: string[]): Observable<CamfilB2bUser[]> {
    return forkJoin([
      ...customerIDs.map(customerId =>
        this.getCustomerUsers(customerId).pipe(
          map(users => users.map(user => ({ ...user, customerId }))),
          defaultIfEmpty([]),
          catchError(() => of([]))
        )
      ),
    ]).pipe(concatAll());
  }
}
