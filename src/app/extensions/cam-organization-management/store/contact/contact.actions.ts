import { createAction } from '@ngrx/store';

import { httpError, payload } from 'ish-core/utils/ngrx-creators';

import { CamfilB2bContact } from '../../models/camfil-b2b-contact/camfil-b2b-contact.model';

// Initialized

export const setContactsInitialized = createAction(
  '[Camfil Contact Internal] Set Initialized',
  payload<{ initialized: boolean }>()
);

// Customer -> Contacts

export const loadCustomerContacts = createAction(
  '[Camfil Contact] Load Customer Contacts',
  payload<{ customerId: string }>()
);

export const loadCustomerContactsFail = createAction('[Camfil Contact API] Load Customer Contacts Fail', httpError());

export const loadCustomerContactsSuccess = createAction(
  '[Camfil Contact API] Load Customer Contacts Success',
  payload<{ customerId: string; contacts: CamfilB2bContact[] }>()
);

// Customer -> Contact

export const loadCustomerContact = createAction(
  '[Camfil Contact] Load Customer Contact',
  payload<{ customerId: string; erpId: string }>()
);

export const loadCustomerContactFail = createAction('[Camfil Contact API] Load Customer Contact Fail', httpError());

export const loadCustomerContactSuccess = createAction(
  '[Camfil Contact API] Load Customer Contact Success',
  payload<{ customerId: string; contact: CamfilB2bContact }>()
);

// Customer -> User -> Contact

export const loadCustomerUserContact = createAction(
  '[Camfil Contact] Load Customer User Contact',
  payload<{ customerId: string; userId: string }>()
);

export const loadCustomerUserContactFail = createAction(
  '[Camfil Contact API] Load Customer User Contact Fail',
  httpError()
);

export const loadCustomerUserContactSuccess = createAction(
  '[Camfil Contact API] Load Customer User Contact Success',
  payload<{ customerId: string; userId: string; contact: CamfilB2bContact }>()
);
