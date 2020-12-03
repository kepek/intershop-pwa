import { createAction } from '@ngrx/store';

import { httpError, payload } from 'ish-core/utils/ngrx-creators';

import { CamfilB2bCustomer } from '../../models/camfil-b2b-customer/camfil-b2b-customer.model';

// Initialized

export const setCustomersInitialized = createAction(
  '[Camfil Customer Internal] Set Initialized',
  payload<{ initialized: boolean }>()
);

// Customers

export const loadCustomers = createAction('[Camfil Customer Internal] Load Customers');

export const loadCustomersFail = createAction('[Camfil Customer API] Load Customers Fail', httpError());

export const loadCustomersSuccess = createAction(
  '[Camfil Customer API] Load Customers Success',
  payload<{ customers: CamfilB2bCustomer[] }>()
);

// Customer

export const selectCustomer = createAction(
  '[Camfil Customer Internal] Select Customer',
  payload<{ customerId: string }>()
);

export const loadCustomer = createAction('[Camfil Customer API] Load Customer', payload<{ customerId: string }>());

export const loadCustomerFail = createAction('[Camfil Customer API] Load Customer Fail', httpError());

export const loadCustomerSuccess = createAction(
  '[Camfil Customer API] Load Customer Success',
  payload<{ customer: CamfilB2bCustomer }>()
);
