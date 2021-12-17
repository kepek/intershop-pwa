import { createAction } from '@ngrx/store';

import { Address } from 'ish-core/models/address/address.model';
import { ZipCodeInfo } from 'ish-core/models/zip-codes/zip-codes.interface';
import { httpError, payload } from 'ish-core/utils/ngrx-creators';

export const loadAddresses = createAction('[Address Internal] Load Addresses');

export const loadAddressesFail = createAction('[Address API] Load Addresses Fail', httpError());

export const loadAddressesSuccess = createAction(
  '[Address API] Load Addresses Success',
  payload<{ addresses: Address[] }>()
);

export const createCustomerAddress = createAction('[Address] Create Customer Address', payload<{ address: Address }>());

export const createCustomerAddressFail = createAction('[Address API] Create Customer Address Fail', httpError());

export const createCustomerAddressSuccess = createAction(
  '[Address API] Create Customer Address Success',
  payload<{ address: Address }>()
);

export const updateCustomerAddressFail = createAction('[Address API] Update Customer Address Fail', httpError());

export const updateCustomerAddressSuccess = createAction(
  '[Address API] Update Customer Address Success',
  payload<{ address: Address }>()
);

export const deleteCustomerAddress = createAction(
  '[Address] Delete Customer Address',
  payload<{ addressId: string }>()
);

export const deleteCustomerAddressFail = createAction('[Address API] Delete Customer Address Fail', httpError());

export const deleteCustomerAddressSuccess = createAction(
  '[Address API] Delete Customer Address Success',
  payload<{ addressId: string }>()
);

export const loadZipCode = createAction(
  '[Address API] load Zip Code',
  payload<{ code: string; countryCode: string }>()
);

export const loadZipCodeFail = createAction('[Address API] load Zip Code Fail', httpError());

export const loadZipCodeSuccess = createAction(
  '[Address API] load Zip Code Success',
  payload<{ codeInfo: ZipCodeInfo[] }>()
);
