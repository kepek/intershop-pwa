import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { setErrorOn, setLoadingOn, unsetLoadingAndErrorOn } from 'ish-core/utils/ngrx-creators';

import { CamfilB2bRole } from '../../models/camfil-b2b-role/camfil-b2b-role.model';

import {
  loadCustomerRoles,
  loadCustomerRolesFail,
  loadCustomerRolesSuccess,
  updateCustomerUserRoles,
  updateCustomerUserRolesFail,
  updateCustomerUserRolesSuccess,
} from './role.actions';

export const roleAdapter = createEntityAdapter<CamfilB2bRole>({
  selectId: role => role.id,
});

export interface RoleState extends EntityState<CamfilB2bRole> {
  loading: boolean;
  error: HttpError;
  initialized: boolean;
}

const initialState: RoleState = roleAdapter.getInitialState({
  loading: false,
  error: undefined,
  initialized: false,
});

export const roleReducer = createReducer(
  initialState,
  setLoadingOn(loadCustomerRoles, updateCustomerUserRoles),
  setErrorOn(loadCustomerRolesFail, updateCustomerUserRolesFail),
  unsetLoadingAndErrorOn(loadCustomerRolesSuccess, updateCustomerUserRolesSuccess),
  on(loadCustomerRolesSuccess, updateCustomerUserRolesSuccess, state => ({ ...state, initialized: true })),
  on(loadCustomerRolesSuccess, (state: RoleState, action) => {
    const { roles } = action.payload;

    return {
      ...roleAdapter.upsertMany(roles, state),
    };
  }),
  on(updateCustomerUserRolesSuccess, (state: RoleState, action) => {
    const { roles } = action.payload;

    return roleAdapter.upsertMany(roles, state);
  })
);
