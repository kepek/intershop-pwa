import { createSelector } from '@ngrx/store';

import { getCamAccountState } from '../cam-account-store';

const getUserState = createSelector(getCamAccountState, state => state.user);

export const getUsernameReminderSuccess = createSelector(getUserState, state => state.usernameReminderSuccess);

export const getUsernameReminderError = createSelector(getUserState, state => state.usernameReminderError);

export const getLoading = createSelector(getUserState, state => state.loading);

export const getError = createSelector(getUserState, state => state.error);
