import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { setErrorOn, setLoadingOn, unsetLoadingAndErrorOn } from 'ish-core/utils/ngrx-creators';

import { CamfilB2bUser } from '../../models/camfil-b2b-user/camfil-b2b-user.model';
import { updateCustomerUserRolesSuccess } from '../role';

import {
  activateCustomerUser,
  activateCustomerUserFail,
  activateCustomerUserSuccess,
  connectContactWithUserAndCustomer,
  connectContactWithUserAndCustomerFail,
  connectContactWithUserAndCustomerSuccess,
  createCustomerUser,
  createCustomerUserFail,
  createCustomerUserSuccess,
  deactivateCustomerUser,
  deactivateCustomerUserFail,
  deactivateCustomerUserSuccess,
  disconnectUserFromCustomer,
  disconnectUserFromCustomerFail,
  disconnectUserFromCustomerSuccess,
  loadCustomerUser,
  loadCustomerUserApproversSuccess,
  loadCustomerUserFail,
  loadCustomerUserSuccess,
  loadCustomerUsers,
  loadCustomerUsersFail,
  loadCustomerUsersSuccess,
  loadOrganizationUsers,
  loadOrganizationUsersFail,
  loadOrganizationUsersSuccess,
  selectUser,
  updateCustomerUser,
  updateCustomerUserFail,
  updateCustomerUserSuccess,
} from './user.actions';

export const userAdapter = createEntityAdapter<CamfilB2bUser>({
  selectId: user => user?.id,
});

export interface UserState extends EntityState<CamfilB2bUser> {
  loading: boolean;
  selected: string;
  error: HttpError;
  initialized: boolean;
}

const initialState: UserState = userAdapter.getInitialState({
  loading: false,
  selected: undefined,
  error: undefined,
  initialized: false,
});

export const userReducer = createReducer(
  initialState,
  setLoadingOn(
    loadCustomerUsers,
    loadCustomerUser,
    activateCustomerUser,
    deactivateCustomerUser,
    updateCustomerUser,
    createCustomerUser,
    disconnectUserFromCustomer,
    connectContactWithUserAndCustomer,
    loadOrganizationUsers
  ),
  setErrorOn(
    loadCustomerUsersFail,
    loadCustomerUserFail,
    activateCustomerUserFail,
    deactivateCustomerUserFail,
    updateCustomerUserFail,
    createCustomerUserFail,
    disconnectUserFromCustomerFail,
    connectContactWithUserAndCustomerFail,
    loadOrganizationUsersFail
  ),
  unsetLoadingAndErrorOn(
    loadCustomerUsersSuccess,
    loadCustomerUserSuccess,
    activateCustomerUserSuccess,
    deactivateCustomerUserSuccess,
    updateCustomerUserSuccess,
    createCustomerUserSuccess,
    disconnectUserFromCustomerSuccess,
    connectContactWithUserAndCustomerSuccess,
    loadOrganizationUsersSuccess
  ),
  on(
    loadCustomerUsersSuccess,
    loadCustomerUserSuccess,
    activateCustomerUserSuccess,
    deactivateCustomerUserSuccess,
    updateCustomerUserSuccess,
    createCustomerUserSuccess,
    disconnectUserFromCustomerSuccess,
    connectContactWithUserAndCustomerSuccess,
    loadOrganizationUsersSuccess,
    state => ({ ...state, initialized: true })
  ),
  on(selectUser, (state: UserState, action) => ({
    ...state,
    selected: action.payload.userId,
  })),
  on(loadCustomerUsersSuccess, (state: UserState, action) => {
    const { customerId, users } = action.payload;
    const usersWithCustomerId = [...users.map(user => ({ ...user, customerId }))];

    return userAdapter.upsertMany(usersWithCustomerId, state);
  }),
  on(loadCustomerUserSuccess, (state: UserState, action) => {
    const { customerId, user } = action.payload;
    const userWithCustomerId = { ...user, customerId };

    return userAdapter.upsertOne(userWithCustomerId, state);
  }),
  on(activateCustomerUserSuccess, deactivateCustomerUserSuccess, (state: UserState, action) => {
    const { active, customerId, userId } = action.payload;

    const changedUser = { ...state.entities?.[userId], active, customerId };

    return userAdapter.upsertOne(changedUser, state);
  }),
  on(updateCustomerUserSuccess, createCustomerUserSuccess, (state: UserState, action) => {
    const { user } = action.payload;

    // Dirty hack since we are using existing Intershop API which does not return `user.id`
    const changedUser = { ...Object.values(state?.entities)?.find(u => u.login === user.login), ...user };

    // Skip roleIDs relations;
    delete changedUser.roleIDs;

    return userAdapter.upsertOne(changedUser, state);
  }),
  on(updateCustomerUserRolesSuccess, (state: UserState, action) => {
    const { roles, userId } = action.payload;

    const roleIDs = roles.map(role => role.id);

    return userAdapter.updateOne(
      {
        id: userId,
        changes: {
          roleIDs,
        },
      },
      state
    );
  }),
  on(disconnectUserFromCustomerSuccess, connectContactWithUserAndCustomerSuccess, (state: UserState, action) => {
    const { user } = action.payload;

    return userAdapter.upsertOne(user, state);
  }),
  on(loadOrganizationUsersSuccess, (state: UserState, action) => {
    const { users } = action.payload;

    return userAdapter.upsertMany(users, state);
  }),
  on(loadCustomerUserApproversSuccess, (state: UserState, action) => {
    const { userId, approvers } = action.payload;

    const entities = { ...state.entities };
    const user = entities[userId];
    if (user) {
      entities[userId] = { ...user, approvers };
    }

    return { ...state, entities };
  })
);
