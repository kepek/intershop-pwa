import { createReducer } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { setErrorOn, setLoadingOn, unsetLoadingAndErrorOn } from 'ish-core/utils/ngrx-creators';

import { Applicant } from '../../models/applicant/applicant.model';

import { applyForAnAccount, applyForAnAccountFail, applyForAnAccountSuccess } from './applicant.actions';

export interface ApplicantState {
  applicant: Applicant;
  loading: boolean;
  error: HttpError;
}

export const initialState: ApplicantState = {
  applicant: undefined,
  loading: false,
  error: undefined,
};

export const applicantReducer = createReducer(
  initialState,
  setLoadingOn(applyForAnAccount),
  setErrorOn(applyForAnAccountFail),
  unsetLoadingAndErrorOn(applyForAnAccountSuccess)
);
