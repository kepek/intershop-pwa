import { createReducer, on } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { setErrorOn, setLoadingOn } from 'ish-core/utils/ngrx-creators';

import {
  requestUsernameReminder,
  requestUsernameReminderFail,
  requestUsernameReminderSuccess,
  resetUsernameReminder,
} from './user.actions';

export interface UserState {
  loading: boolean;
  error: HttpError;
  usernameReminderSuccess: boolean;
  usernameReminderError: HttpError;
}

export const initialState: UserState = {
  loading: false,
  error: undefined,
  usernameReminderSuccess: undefined,
  usernameReminderError: undefined,
};

export const userReducer = createReducer(
  initialState,
  setLoadingOn(requestUsernameReminder),
  setErrorOn(requestUsernameReminderFail),
  on(resetUsernameReminder, (state: UserState) => ({
    ...state,
    usernameReminderSuccess: undefined,
    usernameReminderError: undefined,
  })),
  on(requestUsernameReminder, (state: UserState) => ({
    ...state,
    loading: true,
    usernameReminderSuccess: undefined,
    usernameReminderError: undefined,
  })),
  on(requestUsernameReminderSuccess, (state: UserState) => ({
    ...state,
    loading: false,
    usernameReminderSuccess: true,
    usernameReminderError: undefined,
  })),
  on(requestUsernameReminderFail, (state: UserState, action) => ({
    ...state,
    loading: false,
    usernameReminderSuccess: false,
    usernameReminderError: action.payload.error,
  }))
);
