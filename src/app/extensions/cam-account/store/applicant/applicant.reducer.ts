import { createReducer, on } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { setErrorOn, setLoadingOn, unsetLoadingAndErrorOn } from 'ish-core/utils/ngrx-creators';

import { Applicant } from '../../models/applicant/applicant.model';

import {
  applyForAnAccount,
  applyForAnAccountFail,
  applyForAnAccountSuccess,
  loadPreferredTitles,
  loadPreferredTitlesFail,
  loadPreferredTitlesSuccess,
} from './applicant.actions';

export interface ApplicantState {
  applicant: Applicant;
  preferredTitles: string[];
  loading: boolean;
  error: HttpError;
}

export const initialState: ApplicantState = {
  applicant: undefined,
  preferredTitles: [],
  loading: false,
  error: undefined,
};

export const applicantReducer = createReducer(
  initialState,
  setLoadingOn(applyForAnAccount, loadPreferredTitles),
  setErrorOn(applyForAnAccountFail, loadPreferredTitlesFail),
  unsetLoadingAndErrorOn(applyForAnAccountSuccess, loadPreferredTitlesSuccess),
  on(loadPreferredTitlesSuccess, (state: ApplicantState, action) => {
    const { preferredTitles } = action.payload;
    return {
      ...state,
      preferredTitles,
      loading: false,
    };
  })
);
