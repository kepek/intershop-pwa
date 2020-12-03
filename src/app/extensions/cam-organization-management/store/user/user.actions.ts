import { createAction } from '@ngrx/store';

import { httpError, payload } from 'ish-core/utils/ngrx-creators';

import { CamfilB2bCustomer } from '../../models/camfil-b2b-customer/camfil-b2b-customer.model';
import { CamfilB2bUser } from '../../models/camfil-b2b-user/camfil-b2b-user.model';

// Initialized

export const setUsersInitialized = createAction(
  '[Camfil User Internal] Set Initialized',
  payload<{ initialized: boolean }>()
);

// Select

export const selectUser = createAction('[Camfil Users Internal] Select User', payload<{ userId: string }>());

// Customer -> Users

export const loadCustomerUsers = createAction('[Camfil User] Load Customer Users', payload<{ customerId: string }>());

export const loadCustomerUsersFail = createAction('[Camfil Users API] Load Customer Users Fail', httpError());

export const loadCustomerUsersSuccess = createAction(
  '[Camfil Users API] Load Customer Users Success',
  payload<{ customerId: string; users: CamfilB2bUser[] }>()
);

// Customer -> User

export const loadCustomerUser = createAction(
  '[Camfil User] Load Customer User',
  payload<{ customerId: string; userId: string }>()
);

export const loadCustomerUserFail = createAction('[Camfil Users API] Load Customer User Fail', httpError());

export const loadCustomerUserSuccess = createAction(
  '[Camfil Users API] Load Customer User Success',
  payload<{ customerId: string; user: CamfilB2bUser }>()
);

// Customer -> User -> Activate

export const activateCustomerUser = createAction(
  '[Camfil User] Activate Customer User',
  payload<{ customerId: string; userId: string }>()
);

export const activateCustomerUserFail = createAction('[Camfil Users API] Activate Customer User Fail', httpError());

export const activateCustomerUserSuccess = createAction(
  '[Camfil Users API] Activate Customer User Success',
  payload<{ customerId: string; userId: string; active: boolean; successMessage?: string }>()
);

// Customer -> User -> Deactivate

export const deactivateCustomerUser = createAction(
  '[Camfil User] Deactivate Customer User',
  payload<{ customerId: string; userId: string }>()
);

export const deactivateCustomerUserFail = createAction('[Camfil Users API] Deactivate Customer User Fail', httpError());

export const deactivateCustomerUserSuccess = createAction(
  '[Camfil Users API] Deactivate Customer User Success',
  payload<{ customerId: string; userId: string; active: boolean; successMessage?: string }>()
);

// User -> Update

export const updateCustomerUser = createAction(
  '[Camfil User] Update Customer User',
  payload<{ customer: CamfilB2bCustomer; user: CamfilB2bUser }>()
);

export const updateCustomerUserFail = createAction('[Camfil Users API] Update Customer User Fail', httpError());

export const updateCustomerUserSuccess = createAction(
  '[Camfil Users API] Update Customer User Success',
  payload<{ customer: CamfilB2bCustomer; user: CamfilB2bUser; successMessage?: string }>()
);

// User -> Reset Password

export const resetCustomerUserPassword = createAction(
  '[Camfil User] Reset Customer User Password',
  payload<{ customerId: string; userId: string; login: string }>()
);

export const resetCustomerUserPasswordFail = createAction(
  '[Camfil User] Reset Customer User Password Fail',
  httpError()
);

export const resetCustomerUserPasswordSuccess = createAction(
  '[Camfil User] Reset Customer User Password Success',
  payload<{ customerId: string; userId: string; login: string; successMessage?: string }>()
);
