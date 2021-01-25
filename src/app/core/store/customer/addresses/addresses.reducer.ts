import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { Address } from 'ish-core/models/address/address.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
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
  updateCustomerAddressFail,
  updateCustomerAddressSuccess,
} from './addresses.actions';

export const addressAdapter = createEntityAdapter<Address>({});

export interface AddressesState extends EntityState<Address> {
  loading: boolean;
  error: HttpError;
  createdAddress: Address;
}

export const initialState: AddressesState = addressAdapter.getInitialState({
  loading: false,
  error: undefined,
  createdAddress: undefined,
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
  setErrorOn(loadAddressesFail, createCustomerAddressFail, updateCustomerAddressFail, deleteCustomerAddressFail),
  unsetLoadingAndErrorOn(
    loadAddressesSuccess,
    createCustomerAddressSuccess,
    createBasketAddressSuccess,
    updateCustomerAddressSuccess,
    deleteCustomerAddressSuccess
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
  )
);
