import { createSelector } from '@ngrx/store';

import { ZipCodeInfo } from 'ish-core/models/zip-codes/zip-codes.interface';
import { getCustomerState } from 'ish-core/store/customer/customer-store';

import { addressAdapter } from './addresses.reducer';

const getAddressesState = createSelector(getCustomerState, state => state.addresses);

export const { selectAll: getAllAddresses } = addressAdapter.getSelectors(getAddressesState);

export const getAddressesLoading = createSelector(getAddressesState, addresses => addresses.loading);

export const getAddressesError = createSelector(getAddressesState, addresses => addresses.error);

export const getCreatedAddress = createSelector(getAddressesState, addresses => addresses.createdAddress);

export const getZipCodes = createSelector(getAddressesState, addresses => addresses.zipCodes);

export const getZipCodesLoading = createSelector(getAddressesState, addresses => addresses.zipCodesLoading);

export const getZipCode = (code: string) =>
  createSelector(getZipCodes, (zipCodes): ZipCodeInfo => zipCodes && zipCodes[code]);
