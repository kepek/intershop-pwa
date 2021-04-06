import { createAction } from '@ngrx/store';

import { httpError, payload } from 'ish-core/utils/ngrx-creators';

import { CamfilB2bRole } from '../../models/camfil-b2b-role/camfil-b2b-role.model';

// Initialized

export const setRolesInitialized = createAction(
  '[Camfil Role Internal] Set Initialized',
  payload<{ initialized: boolean }>()
);

// Customer -> Roles

export const loadCustomerRoles = createAction('[Camfil Role] Load Customer Roles', payload<{ customerId: string }>());

export const loadCustomerRolesFail = createAction('[Camfil Role API] Load Customer Roles Fail', httpError());

export const loadCustomerRolesSuccess = createAction(
  '[Camfil Role API] Load Customer Roles Success',
  payload<{ customerId: string; roles: CamfilB2bRole[] }>()
);

// Customer -> User -> Roles

export const loadCustomerUserRoles = createAction(
  '[Camfil Role] Load Customer User Roles',
  payload<{ customerId: string; userId: string }>()
);

export const loadCustomerUserRolesFail = createAction('[Camfil Role API] Load Customer User Roles Fail', httpError());

export const loadCustomerUserRolesSuccess = createAction(
  '[Camfil Role API] Load Customer User Roles Success',
  payload<{ customerId: string; userId: string; roles: CamfilB2bRole[] }>()
);

// Customer -> User -> Roles -> Update

export const updateCustomerUserRoles = createAction(
  '[Camfil Role] Update Roles',
  payload<{ customerId: string; userId: string; roleIDs: string[] }>()
);

export const updateCustomerUserRolesFail = createAction('[Camfil Role API] Update Roles Fail', httpError());

export const updateCustomerUserRolesSuccess = createAction(
  '[Camfil Role API] Update Roles Success',
  payload<{ customerId: string; userId: string; roles: CamfilB2bRole[]; successMessage?: string }>()
);
