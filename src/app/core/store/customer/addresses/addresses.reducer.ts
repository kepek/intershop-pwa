import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { Address } from 'ish-core/models/address/address.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { ZipCodeInfo } from 'ish-core/models/zip-codes/zip-codes.interface';
import {
  createBasketAddress,
  createBasketAddressSuccess,
  deleteBasketShippingAddress,
  updateBasketAddress,
} from 'ish-core/store/customer/basket';
import { setErrorOn, setLoadingOn, unsetLoadingAndErrorOn } from 'ish-core/utils/ngrx-creators';

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
  updateCustomerAddressFail,
  updateCustomerAddressSuccess,
} from './addresses.actions';

export const addressAdapter = createEntityAdapter<Address>({});

export interface AddressesState extends EntityState<Address> {
  loading: boolean;
  error: HttpError;
  createdAddress: Address;
  zipCodes?: {
    [code: string]: ZipCodeInfo[];
  };
  zipCodesLoading?: boolean;
}

export const initialState: AddressesState = addressAdapter.getInitialState({
  loading: false,
  error: undefined,
  createdAddress: undefined,
  zipCodes: undefined,
  zipCodesLoading: false,
});

export const addressesReducer = createReducer(
  initialState,
  setLoadingOn(
    loadAddresses,
    createCustomerAddress,
    createBasketAddress,
    updateBasketAddress,
    deleteCustomerAddress,
    deleteBasketShippingAddress
  ),
  setErrorOn(
    loadAddressesFail,
    createCustomerAddressFail,
    updateCustomerAddressFail,
    deleteCustomerAddressFail,
    loadZipCodeFail
  ),
  unsetLoadingAndErrorOn(
    loadAddressesSuccess,
    createCustomerAddressSuccess,
    createBasketAddressSuccess,
    updateCustomerAddressSuccess,
    deleteCustomerAddressSuccess,
    loadZipCodeSuccess
  ),
  on(loadAddressesSuccess, (state: AddressesState, action) => addressAdapter.setAll(action.payload.addresses, state)),
  on(
    createCustomerAddressSuccess,
    createBasketAddressSuccess,
    updateCustomerAddressSuccess,
    (state: AddressesState, action) => addressAdapter.upsertOne(action.payload.address, state)
  ),
  on(createBasketAddressSuccess, (state: AddressesState, action) => ({
    ...state,
    createdAddress: action.payload.address,
  })),
  on(createBasketAddress, (state: AddressesState) => ({
    ...state,
    createdAddress: undefined,
  })),
  on(deleteCustomerAddressSuccess, (state: AddressesState, action) =>
    addressAdapter.removeOne(action.payload.addressId, state)
  ),
  on(loadZipCode, (state: AddressesState) => ({
    ...state,
    zipCodesLoading: true,
  })),
  on(loadZipCodeFail, (state: AddressesState) => ({
    ...state,
    zipCodesLoading: false,
  })),
  on(loadZipCodeSuccess, (state: AddressesState, { payload }) => ({
    ...state,
    zipCodes: {
      ...state.zipCodes,
      [payload.codeInfo[0].zipCode]: payload.codeInfo,
    },
    zipCodesLoading: false,
  }))
);
