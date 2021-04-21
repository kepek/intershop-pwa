import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { pick } from 'lodash-es';
import { Observable, forkJoin, iif, of, throwError } from 'rxjs';
import { catchError, concatAll, concatMap, map, mergeMap, switchMap } from 'rxjs/operators';

import { AppFacade } from 'ish-core/facades/app.facade';
import { AddressData } from 'ish-core/models/address/address.interface';
import { AddressMapper } from 'ish-core/models/address/address.mapper';
import { Address } from 'ish-core/models/address/address.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { PasswordReminder } from 'ish-core/models/password-reminder/password-reminder.model';
import { ApiService, AvailableOptions, unpackEnvelope } from 'ish-core/services/api/api.service';

import { CamCardData } from '../../../cam-cards/models/cam-card/cam-card.interface';
import { CamCardMapper } from '../../../cam-cards/models/cam-card/cam-card.mapper';
import { CamCard } from '../../../cam-cards/models/cam-card/cam-card.model';
import { CamfilB2bContactData } from '../../models/camfil-b2b-contact/camfil-b2b-contact.interface';
import { CamfilB2bContactMapper } from '../../models/camfil-b2b-contact/camfil-b2b-contact.mapper';
import { CamfilB2bContact } from '../../models/camfil-b2b-contact/camfil-b2b-contact.model';
import { CamfilB2bCustomerData } from '../../models/camfil-b2b-customer/camfil-b2b-customer.interface';
import { CamfilB2bCustomerMapper } from '../../models/camfil-b2b-customer/camfil-b2b-customer.mapper';
import {
  CamfilB2bCustomer,
  CamfilB2bCustomerContact,
} from '../../models/camfil-b2b-customer/camfil-b2b-customer.model';
import { CamfilB2bOrganizationUser } from '../../models/camfil-b2b-organization/camfil-b2b-organization.model';
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
    private appFacade: AppFacade
  ) {}

  private static isUsersNotFoundError(err: HttpError) {
    return err.name === 'HttpErrorResponse' && err.message === 'The user could not be found.' && err.status === 404;
  }

  // Customers

  getCustomers(): Observable<CamfilB2bCustomer[]> {
    return this.apiService
      .get<CamfilB2bCustomerData[]>(`camfilcustomers`)
      .pipe(unpackEnvelope(), map(CamfilB2bCustomerMapper.fromListData));
  }

  // Customer

  getCustomer(customerId: string): Observable<CamfilB2bCustomer> {
    return this.apiService.get<CamfilB2bCustomerData>(`camfilcustomers/${customerId}`).pipe(
      map(CamfilB2bCustomerMapper.fromData),
      // TODO (extMlk): This need to be removed whenever Back-end will be fixed. See the error details below.
      // Error: Forbidden (The supplied user is not allowed to access 'camfilcustomers/XXXX' using 'GET')
      catchError(() =>
        this.getCustomers().pipe(map(customers => customers.find(customer => customer.id === customerId)))
      )
    );
  }

  // Customer -> Delivery Addresses

  getCustomerDeliveryAddresses(customerId: string): Observable<Address[]> {
    return this.apiService.get<AddressData[]>(`camfilcustomers/${customerId}/deliveryaddresses`).pipe(
      unpackEnvelope(),
      map(deliverAddresses => deliverAddresses.map(AddressMapper.fromData))
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
    const options: AvailableOptions = {
      skipApiErrorHandling: true,
    };

    return this.apiService.get(`camfilcustomers/${customerId}/roles`, options).pipe(
      unpackEnvelope<CamfilB2bRoleData>('userRoles'),
      map(data => this.b2bRoleMapper.fromData(data))
    );
  }

  // Customer -> CamCards

  getCustomerCamCards(customerId: string): Observable<CamCard[]> {
    return this.apiService
      .get<CamCardData[]>(`privatecamfilcustomers/${customerId}/camcards`)
      .pipe(unpackEnvelope<CamCardData>(), map(this.camCardMapper.fromListData));
  }

  // Customer -> Contacts

  getCustomerContacts(customerId: string): Observable<CamfilB2bContact[]> {
    return this.apiService
      .get<CamfilB2bContactData[]>(`privatecamfilcustomers/${customerId}/contacts`)
      .pipe(unpackEnvelope(), map(CamfilB2bContactMapper.fromListData));
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
    const options: AvailableOptions = {
      skipApiErrorHandling: true,
    };

    return this.apiService.get<CamfilB2bUserData>(`privatecamfilcustomers/${customerId}/users`, options).pipe(
      unpackEnvelope(),
      map(CamfilB2bUserMapper.fromListData),
      catchError(err => {
        if (CamOrganizationService.isUsersNotFoundError(err)) {
          return of([]);
        }

        return throwError(err);
      })
    );
  }

  // Customer -> User

  getCustomerUser(customerId: string, userId: string): Observable<CamfilB2bUser> {
    return this.apiService.get<CamfilB2bUserData>(`privatecamfilcustomers/${customerId}/users/${userId}`).pipe(
      map(CamfilB2bUserMapper.fromData),
      // TODO (extMlk): This need to be removed whenever Back-end will be fixed. See the error details below.
      // Error: Forbidden (The supplied user is not allowed to access 'privatecamfilcustomers/XXXX/users/YYY' using 'GET')
      catchError(() => this.getCustomerUsers(customerId).pipe(map(users => users.find(user => user.id === userId))))
    );
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
    const roleIDs = [...roles].map(r => r.id);

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
            mergeMap(() =>
              this.getCustomerUsers(customer.id).pipe(map(users => users.find(u => u.login === user.login)))
            )
          )
          .pipe(
            mergeMap(createdUser => {
              const updateContacts = contacts.map(payload =>
                this.updateCustomerUserContact(payload.customer.id, createdUser.id, payload.contact)
              );

              const newUser$ = this.getCustomerUser(customer.id, createdUser.id);

              return forkJoin([
                this.updateCustomerUserRoles(customer.id, createdUser.id, roleIDs),
                ...updateContacts,
              ]).pipe(
                mergeMap(() => newUser$),
                catchError(() => newUser$)
              );
            })
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

  updateCustomerUserContact(
    customerId: string,
    userId: string,
    contact: CamfilB2bContact
  ): Observable<CamfilB2bContact> {
    const body = contact;

    return this.apiService
      .post<CamfilB2bContactData>(`privatecamfilcustomers/${customerId}/users/${userId}/contact`, body)
      .pipe(
        map(CamfilB2bContactMapper.fromData)
        // TODO (extMlk): This need to be removed whenever Back-end will be fixed. See the error details below.
        // Error: Forbidden (The supplied user is not allowed to access 'privatecamfilcustomers/XXXX/users/YYY/contact' using 'POST')
        // tslint:disable-next-line:no-commented-out-code
        // catchError(() => of(body))
      );
  }

  deleteCustomerUserContact(
    customerId: string,
    userId: string,
    contact: CamfilB2bContact
  ): Observable<CamfilB2bContact> {
    // TODO (extMlk): Talk to BE that body entity when using DELETE request method is not necessary and suggest passing additional ID param in the url.
    return this.apiService
      .delete<CamfilB2bContact>(`privatecamfilcustomers/${customerId}/users/${userId}/contact/${contact.erpId}`)
      .pipe(
        map(CamfilB2bContactMapper.fromData)
        // TODO (extMlk): This need to be removed whenever Back-end will be fixed. See the error details below.
        // Error: Forbidden (The supplied user is not allowed to access 'privatecamfilcustomers/XXXX/users/YYY/contact' using 'DELETE')
        // tslint:disable-next-line:no-commented-out-code
        // catchError(() => of(contact))
      );
  }

  // Customer -> User -> Roles

  getCustomerUserRoles(customerId: string, userId: string): Observable<CamfilB2bRole[]> {
    const options: AvailableOptions = {
      skipApiErrorHandling: true,
    };

    return this.apiService
      .get<CamfilB2bRoleData>(`privatecamfilcustomers/${customerId}/users/${userId}/role`, options)
      .pipe(
        unpackEnvelope<CamfilB2bRoleData>('userRoles'),
        map(data => this.b2bRoleMapper.fromData(data))
      );
  }

  updateCustomerUserRoles(customerId: string, userId: string, roleIDs: string[]): Observable<CamfilB2bRole[]> {
    const body: CamfilB2bRoleIDsData = { userRoles: roleIDs };

    return this.apiService
      .put<CamfilB2bRoleIDsData>(`privatecamfilcustomers/${customerId}/users/${userId}/role`, body)
      .pipe(
        unpackEnvelope<CamfilB2bRoleData>('userRoles'),
        map(data => this.b2bRoleMapper.fromData(data))
      );
  }

  // Organization -> Users

  getOrganizationUsers(): Observable<CamfilB2bOrganizationUser[]> {
    return this.getCustomers().pipe(
      map(customers =>
        customers.map(customer =>
          this.getCustomerUsers(customer.id).pipe(
            map(users => users.map(user => ({ ...user, customer, customerId: customer.id }))),
            catchError(of)
          )
        )
      ),
      concatMap(obsArray => iif(() => !!obsArray.length, forkJoin([...obsArray]), of([]))),
      concatAll()
    );
  }

  resetCustomerUserPassword(customerId: string, userId: string, email: string) {
    const data: PasswordReminder = {
      email,
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
        email,
        data,
      }))
    );
  }
}
