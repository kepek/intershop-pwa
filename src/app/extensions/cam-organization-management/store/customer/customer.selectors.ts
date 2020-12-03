import { createSelector } from '@ngrx/store';

import { CamfilB2bCustomer } from '../../models/camfil-b2b-customer/camfil-b2b-customer.model';
import { getCamOrganizationManagementState } from '../cam-organization-management-store';

import { customerAdapter } from './customer.reducer';

const getCustomerState = createSelector(getCamOrganizationManagementState, state => state.customers);

export const getCustomersLoading = createSelector(getCustomerState, state => state.loading);

export const getCustomersError = createSelector(getCustomerState, state => state.error);

const { selectAll, selectEntities, selectTotal } = customerAdapter.getSelectors(getCustomerState);

export const getCustomers = selectAll;

export const getCustomer = (id: string) => createSelector(getCustomers, customers => customers?.find(c => c.id === id));

export const getCustomersCount = selectTotal;

export const getSelectedCustomerId = createSelector(getCustomerState, state => state.selected);

export const getSelectedCustomer = createSelector(
  selectEntities,
  getSelectedCustomerId,
  (entities, id): CamfilB2bCustomer => id && entities[id]
);

export const isCustomerInitialized = createSelector(getCustomerState, state => state.initialized);
