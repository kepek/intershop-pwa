import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { concatMap, filter, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';

import { AddressService } from 'ish-core/services/address/address.service';
import { displaySuccessMessage } from 'ish-core/store/core/messages';
import { getLoggedInCustomer } from 'ish-core/store/customer/user';
import { mapErrorToAction, mapToPayload, mapToPayloadProperty } from 'ish-core/utils/operators';

import {
  createCustomerAddress,
  createCustomerAddressFail,
  createCustomerAddressSuccess,
  deleteCustomerAddress,
  deleteCustomerAddressFail,
  deleteCustomerAddressSuccess,
  loadAddresses,
  loadAddressesFail,
  loadAddressesSuccess,
  loadZipCode,
  loadZipCodeFail,
  loadZipCodeSuccess,
} from './addresses.actions';
import { getZipCodes } from './addresses.selectors';

@Injectable()
export class AddressesEffects {
  constructor(private actions$: Actions, private addressService: AddressService, private store: Store) {}

  loadAddresses$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadAddresses),
      switchMap(() =>
        this.addressService.getCustomerAddresses().pipe(
          map(addresses => loadAddressesSuccess({ addresses })),
          mapErrorToAction(loadAddressesFail)
        )
      )
    )
  );

  /**
   * Creates a new customer address.
   */
  createCustomerAddress$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createCustomerAddress),
      mapToPayloadProperty('address'),
      withLatestFrom(this.store.pipe(select(getLoggedInCustomer))),
      filter(([address, customer]) => !!address || !!customer),
      concatMap(([address, customer]) =>
        this.addressService.createCustomerAddress(customer.customerNo, address).pipe(
          mergeMap(newAddress => [
            createCustomerAddressSuccess({ address: newAddress }),
            displaySuccessMessage({
              message: 'account.addresses.new_address_created.message',
            }),
          ]),
          mapErrorToAction(createCustomerAddressFail)
        )
      )
    )
  );

  /**
   * Deletes a customer address.
   */
  deleteCustomerAddress$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteCustomerAddress),
      mapToPayloadProperty('addressId'),
      withLatestFrom(this.store.pipe(select(getLoggedInCustomer))),
      filter(([addressId, customer]) => !!addressId || !!customer),
      mergeMap(([addressId, customer]) =>
        this.addressService.deleteCustomerAddress(customer.customerNo, addressId).pipe(
          mergeMap(id => [
            deleteCustomerAddressSuccess({ addressId: id }),
            displaySuccessMessage({ message: 'account.addresses.new_address_deleted.message' }),
          ]),
          mapErrorToAction(deleteCustomerAddressFail)
        )
      )
    )
  );

  /**
   * Load Zip Code.
   */
  loadZipCode$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadZipCode),
      mapToPayload(),
      withLatestFrom(this.store.pipe(select(getZipCodes))),
      mergeMap(([{ code, countryCode }, codes]) =>
        !codes || !codes[code]
          ? this.addressService.loadZipCode(code, countryCode).pipe(
              mergeMap(codeInfo => [loadZipCodeSuccess({ codeInfo })]),
              mapErrorToAction(loadZipCodeFail)
            )
          : [loadZipCodeSuccess({ codeInfo: codes[code] })]
      )
    )
  );
}
