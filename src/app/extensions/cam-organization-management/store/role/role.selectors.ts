import { createSelector } from '@ngrx/store';

import { getCamOrganizationManagementState } from '../cam-organization-management-store';

import { roleAdapter } from './role.reducer';

const getRoleState = createSelector(getCamOrganizationManagementState, state => state.roles);

export const getRolesLoading = createSelector(getRoleState, state => state.loading);

export const getRolesError = createSelector(getRoleState, state => state.error);

const { selectAll, selectTotal } = roleAdapter.getSelectors(getRoleState);

export const getRoles = selectAll;

export const getRole = (roleID: string) => createSelector(getRoles, roles => roles?.find(u => u.id === roleID));

export const getRolesByIds = (roleIDs: string[]) =>
  createSelector(getRoles, roles =>
    // preserve order from state
    roles.filter(r => roleIDs?.includes(r.id))
  );

export const getRolesCount = selectTotal;

export const isRoleInitialized = createSelector(getRoleState, state => state.initialized);
