import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { concatMap, first, map, mapTo, withLatestFrom } from 'rxjs/operators';

import { AppFacade } from 'ish-core/facades/app.facade';
import { AddressMapper } from 'ish-core/models/address/address.mapper';
import { Address } from 'ish-core/models/address/address.model';
import { Link } from 'ish-core/models/link/link.model';
import { ZipCodeData, ZipCodeInfo } from 'ish-core/models/zip-codes/zip-codes.interface';
import { ApiService, unpackEnvelope } from 'ish-core/services/api/api.service';
import { getCurrentLocale } from 'ish-core/store/core/configuration';

/**
 * The Address Service handles the interaction with the REST API concerning addresses.
 */
@Injectable({ providedIn: 'root' })
export class AddressService {
  getCountryISO3 = require('country-iso-2-to-3');
  constructor(private apiService: ApiService, private store: Store, private appFacade: AppFacade) {}

  /**
   * Gets the addresses for the given customer id. Falls back to '-' as customer id to get the addresses for the current user.
   * @param customerId  The customer id.
   * @returns           The customer's addresses.
   */
  getCustomerAddresses(customerId: string = '-'): Observable<Address[]> {
    return this.appFacade.customerRestResource$.pipe(
      first(),
      concatMap(restResource =>
        this.apiService.get(`${restResource}/${customerId}/addresses`).pipe(
          unpackEnvelope<Link>(),
          this.apiService.resolveLinks<Address>(),
          map(addressesData => addressesData.map(AddressMapper.fromData))
        )
      )
    );
  }

  /**
   * Creates an address for the given customer id. Falls back to '-' as customer id if no customer id is given
   * @param customerId  The customer id.
   * @param address     The address which should be created
   * @returns           The new customer's address.
   */
  createCustomerAddress(customerId: string = '-', address: Address): Observable<Address> {
    const customerAddress = {
      ...address,
      mainDivision: address.mainDivisionCode,
    };

    return this.appFacade.customerRestResource$.pipe(
      first(),
      concatMap(restResource =>
        this.apiService
          .post(`${restResource}/${customerId}/addresses`, customerAddress)
          .pipe(this.apiService.resolveLink<Address>(), map(AddressMapper.fromData))
      )
    );
  }

  /**
   * Updates an address for the given customer id. Falls back to '-' as customer id if no customer id is given
   * @param customerId  The customer id.
   * @param address     The address
   */
  updateCustomerAddress(customerId: string = '-', address: Address): Observable<Address> {
    const customerAddress = {
      ...address,
      mainDivision: address.mainDivisionCode,
    };

    return this.appFacade.customerRestResource$.pipe(
      first(),
      concatMap(restResource =>
        this.apiService
          .put(`${restResource}/${customerId}/addresses/${address.id}`, customerAddress)
          .pipe(map(AddressMapper.fromData))
      )
    );
  }

  /**
   * Deletes an address for the given customer id. Falls back to '-' as customer id if no customer id is given
   * @param customerId  The customer id.
   * @param address     The address id
   * @returns           The id of the deleted address.
   */
  deleteCustomerAddress(customerId: string = '-', addressId: string): Observable<string> {
    return this.appFacade.customerRestResource$.pipe(
      first(),
      concatMap(restResource =>
        this.apiService.delete(`${restResource}/${customerId}/addresses/${addressId}`).pipe(mapTo(addressId))
      )
    );
  }

  loadZipCode(code: string, countryCod: string): Observable<ZipCodeInfo> {
    if (!code || !countryCod) {
      return throwError('loadZipCode() called without code or countryCod');
    }

    const data = {
      country: countryCod.length === 2 ? this.getCountryISO3(countryCod) : countryCod,
      zipCode: code.replace(' ', ''),
    };
    return this.apiService.post<ZipCodeData[]>(`zipcodequery`, data).pipe(
      withLatestFrom(this.store.pipe(select(getCurrentLocale))),
      map(([info, currentLocale]) => AddressMapper.zipCodefromData(code, info, currentLocale))
    );
  }
}
