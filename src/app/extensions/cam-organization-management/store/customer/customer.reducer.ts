import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { setErrorOn, setLoadingOn, unsetLoadingAndErrorOn } from 'ish-core/utils/ngrx-creators';

import { CamfilB2bCustomer } from '../../models/camfil-b2b-customer/camfil-b2b-customer.model';
import { canHaveOnly1ParentCompany } from '../cam-organization-management-store.config';
import { loadCustomerContactSuccess, loadCustomerContactsSuccess, loadCustomerUserContactSuccess } from '../contact';
import { loadCustomerRolesSuccess } from '../role';
import { loadCustomerUserSuccess, loadCustomerUsersSuccess } from '../user';

import {
  loadCustomerSuccess,
  loadCustomers,
  loadCustomersFail,
  loadCustomersSuccess,
  selectCustomer,
} from './customer.actions';

export const customerAdapter = createEntityAdapter<CamfilB2bCustomer>({
  selectId: customer => customer?.id,
});

export interface CustomerState extends EntityState<CamfilB2bCustomer> {
  loading: boolean;
  selected: string;
  error: HttpError;
  initialized: boolean;
}

const initialState: CustomerState = customerAdapter.getInitialState({
  loading: false,
  selected: undefined,
  error: undefined,
  initialized: false,
});

export const customerReducer = createReducer(
  initialState,
  setLoadingOn(loadCustomers),
  setErrorOn(loadCustomersFail, loadCustomersFail),
  unsetLoadingAndErrorOn(loadCustomersSuccess, loadCustomerSuccess),
  on(loadCustomersSuccess, state => ({ ...state, initialized: true })),
  on(selectCustomer, (state: CustomerState, action) => ({
    ...state,
    selected: action.payload.customerId,
  })),
  on(loadCustomersSuccess, (state: CustomerState, action) => {
    const { customers } = action.payload;

    return customerAdapter.upsertMany(customers, state);
  }),
  on(loadCustomerSuccess, (state: CustomerState, action) => {
    const { customer } = action.payload;

    return customerAdapter.upsertOne(customer, state);
  }),
  // Customer -> Users
  on(loadCustomerUsersSuccess, (state: CustomerState, action) => {
    const { customerId, users } = action.payload;

    const customerUserIDs = state?.entities?.[customerId]?.userIDs || [];
    const userIDs = [...new Set([...customerUserIDs, ...users.map(user => user.id)])];

    return customerAdapter.updateOne(
      {
        id: customerId,
        changes: {
          userIDs,
        },
      },
      state
    );
  }),
  // Customer -> User
  on(loadCustomerUserSuccess, (state: CustomerState, action) => {
    const { customerId, user } = action.payload;

    const customerUserIDs = state?.entities?.[customerId]?.userIDs || [];
    const userIDs = [...new Set([...customerUserIDs, user.id])];

    return customerAdapter.updateOne(
      {
        id: customerId,
        changes: {
          userIDs,
        },
      },
      state
    );
  }),
  // Customer -> Roles
  on(loadCustomerRolesSuccess, (state: CustomerState, action) => {
    const { customerId, roles } = action.payload;

    const customerRoleIDs = state?.entities?.[customerId]?.roleIDs || [];
    const roleIDs = [...new Set([...customerRoleIDs, ...roles.map(role => role.id)])];

    if (canHaveOnly1ParentCompany) {
      const updates = Object.keys(state.entities)?.map(id => ({
        id,
        changes: {
          roleIDs,
        },
      }));

      return customerAdapter.updateMany(updates, state);
    }

    return customerAdapter.updateOne(
      {
        id: customerId,
        changes: {
          roleIDs,
        },
      },
      state
    );
  }),
  // Customer -> Contacts
  on(loadCustomerContactsSuccess, (state: CustomerState, action) => {
    const { customerId, contacts } = action.payload;

    const customerContactIDs = state?.entities?.[customerId]?.contactIDs || [];
    const contactIDs = [...new Set([...customerContactIDs, ...contacts.map(contact => contact.erpId)])];

    return customerAdapter.updateOne(
      {
        id: customerId,
        changes: {
          contactIDs,
        },
      },
      state
    );
  }),
  // Customer -> Contact
  on(loadCustomerContactSuccess, (state: CustomerState, action) => {
    const { customerId, contact } = action.payload;

    const contactId = contact?.erpId;
    const customerContactIDs = state?.entities?.[customerId]?.contactIDs || [];
    const contactIDs = [...new Set([...customerContactIDs, contactId])];

    return customerAdapter.updateOne(
      {
        id: customerId,
        changes: {
          contactIDs,
        },
      },
      state
    );
  }),
  // Customer -> User -> Contact
  on(loadCustomerUserContactSuccess, (state: CustomerState, action) => {
    const { customerId, contact } = action.payload;

    const contactId = contact?.erpId;
    const customerContactIDs = state?.entities?.[customerId]?.contactIDs || [];
    const contactIDs = [...new Set([...customerContactIDs, contactId])];

    return customerAdapter.updateOne(
      {
        id: customerId,
        changes: {
          contactIDs,
        },
      },
      state
    );
  })
);
