import { createReducer, on } from '@ngrx/store';
import { CamfilApplicant } from 'camfil-pwa/models/camfil-applicant/camfil-applicant.model';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { setErrorOn, setLoadingOn, unsetLoadingAndErrorOn } from 'ish-core/utils/ngrx-creators';

import {
  applyForAnAccount,
  applyForAnAccountFail,
  applyForAnAccountSuccess,
  loadPreferredTitles,
  loadPreferredTitlesFail,
  loadPreferredTitlesSuccess,
  requestApplicantReminder,
  requestApplicantReminderFail,
  requestApplicantReminderSuccess,
  resetUsernameReminder,
} from './camfil-user.actions';

export interface CamfilUserState {
  loading: boolean;
  error: HttpError;
  reminderSuccess: boolean;
  reminderError: HttpError;
  applicant: CamfilApplicant;
  preferredTitles: string[];
}

export const initialState: CamfilUserState = {
  loading: false,
  error: undefined,
  reminderSuccess: undefined,
  reminderError: undefined,
  applicant: undefined,
  preferredTitles: [],
};

export const camfilUserReducer = createReducer(
  initialState,
  setLoadingOn(requestApplicantReminder, applyForAnAccount, loadPreferredTitles),
  unsetLoadingAndErrorOn(applyForAnAccountSuccess, loadPreferredTitlesSuccess),
  setErrorOn(requestApplicantReminderFail, applyForAnAccountFail, loadPreferredTitlesFail),
  on(resetUsernameReminder, (state: CamfilUserState) => ({
    ...state,
    usernameReminderSuccess: undefined,
    usernameReminderError: undefined,
  })),
  on(requestApplicantReminder, (state: CamfilUserState) => ({
    ...state,
    loading: true,
    usernameReminderSuccess: undefined,
    usernameReminderError: undefined,
  })),
  on(requestApplicantReminderSuccess, (state: CamfilUserState) => ({
    ...state,
    loading: false,
    usernameReminderSuccess: true,
    usernameReminderError: undefined,
  })),
  on(requestApplicantReminderFail, (state: CamfilUserState, action) => ({
    ...state,
    loading: false,
    usernameReminderSuccess: false,
    usernameReminderError: action.payload.error,
  })),
  on(loadPreferredTitlesSuccess, (state: CamfilUserState, action) => {
    const { preferredTitles } = action.payload;
    return {
      ...state,
      preferredTitles,
    };
  })
);
