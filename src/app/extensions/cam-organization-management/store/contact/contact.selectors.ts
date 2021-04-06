import { createSelector } from '@ngrx/store';

import { getCamOrganizationManagementState } from '../cam-organization-management-store';

import { contactAdapter } from './contact.reducer';

const getContactState = createSelector(getCamOrganizationManagementState, state => state.contacts);

export const getContactsLoading = createSelector(getContactState, state => state.loading);

export const getContactsError = createSelector(getContactState, state => state.error);

const { selectAll, selectTotal } = contactAdapter.getSelectors(getContactState);

export const getContacts = selectAll;

export const getContact = (erpId: string) =>
  createSelector(getContacts, contacts => contacts?.find(c => c.erpId === erpId));

export const getContactsCount = selectTotal;

export const isContactInitialized = createSelector(getContactState, state => state.initialized);
