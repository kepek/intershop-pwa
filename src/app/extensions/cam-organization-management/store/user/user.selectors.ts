import { createSelector } from '@ngrx/store';

import { CamfilB2bUser } from '../../models/camfil-b2b-user/camfil-b2b-user.model';
import { getCamOrganizationManagementState } from '../cam-organization-management-store';

import { userAdapter } from './user.reducer';

const getUserState = createSelector(getCamOrganizationManagementState, state => state.users);

export const getUsersLoading = createSelector(getUserState, state => state.loading);

export const getUsersError = createSelector(getUserState, state => state.error);

const { selectAll, selectEntities, selectTotal } = userAdapter.getSelectors(getUserState);

export const getUsers = selectAll;

export const getUser = (id: string) => createSelector(getUsers, users => users?.find(u => u.id === id));

export const getUsersCount = selectTotal;

export const getSelectedUserId = createSelector(getUserState, state => state.selected);

export const getSelectedUser = createSelector(
  selectEntities,
  getSelectedUserId,
  (entities, id): CamfilB2bUser => id && entities[id]
);

export const isUserInitialized = createSelector(getUserState, state => state.initialized);
