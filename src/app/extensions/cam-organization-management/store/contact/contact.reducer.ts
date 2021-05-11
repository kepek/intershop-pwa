import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { setErrorOn, setLoadingOn, unsetLoadingAndErrorOn } from 'ish-core/utils/ngrx-creators';

import { CamfilB2bContact } from '../../models/camfil-b2b-contact/camfil-b2b-contact.model';

import {
  loadCustomerContact,
  loadCustomerContactFail,
  loadCustomerContactSuccess,
  loadCustomerContacts,
  loadCustomerContactsFail,
  loadCustomerContactsSuccess,
  loadCustomerUserContact,
  loadCustomerUserContactFail,
  loadCustomerUserContactSuccess,
} from './contact.actions';

export const contactAdapter = createEntityAdapter<CamfilB2bContact>({
  selectId: contact => contact.erpId,
});

export interface ContactState extends EntityState<CamfilB2bContact> {
  loading: boolean;
  error: HttpError;
  initialized: boolean;
}

const initialState: ContactState = contactAdapter.getInitialState({
  loading: false,
  error: undefined,
  initialized: false,
});

export const contactReducer = createReducer(
  initialState,
  setLoadingOn(loadCustomerContacts, loadCustomerContact, loadCustomerUserContact),
  setErrorOn(loadCustomerContactsFail, loadCustomerContactFail, loadCustomerUserContactFail),
  unsetLoadingAndErrorOn(loadCustomerContactsSuccess, loadCustomerContactSuccess, loadCustomerUserContactSuccess),
  on(loadCustomerContactsSuccess, loadCustomerContactSuccess, loadCustomerUserContactSuccess, state => ({
    ...state,
    initialized: true,
  })),
  on(loadCustomerContactsSuccess, (state: ContactState, action) => {
    const { contacts, customerId } = action.payload;

    const contactsWithCustomerIDs = contacts.map(contact => {
      const entityId = contact?.erpId;

      const contactCustomerIDs = state?.entities?.[entityId]?.customerIDs || [];
      const customerIDs = [...new Set([...contactCustomerIDs, customerId])];

      return { ...contact, customerIDs };
    });

    return contactAdapter.upsertMany(contactsWithCustomerIDs, state);
  }),
  on(loadCustomerContactSuccess, loadCustomerUserContactSuccess, (state: ContactState, action) => {
    const { contact, customerId } = action.payload;

    const entityId = contact?.erpId;

    const contactCustomerIDs = state?.entities?.[entityId]?.customerIDs || [];
    const customerIDs = [...new Set([...contactCustomerIDs, customerId])];
    const entity = { ...contact, customerIDs };

    return contactAdapter.upsertOne(entity, state);
  }),
  on(loadCustomerUserContactSuccess, (state: ContactState, action) => {
    const { contact, userId } = action.payload;

    const entityId = contact?.erpId;

    const contactUserIDs = state?.entities?.[entityId]?.userIDs || [];
    const userIDs = [...new Set([...contactUserIDs, userId])];
    const entity = { ...contact, userIDs };

    return contactAdapter.upsertOne(entity, state);
  })
);
