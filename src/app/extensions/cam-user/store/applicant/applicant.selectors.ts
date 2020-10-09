import { createSelector } from '@ngrx/store';

import { getCamUserState } from '../cam-user-store';

/* Applicant */

const getApplicantState = createSelector(getCamUserState, state => state.applicant);

export const getApplicant = createSelector(getApplicantState, state => state.applicant);

export const getApplicantLoading = createSelector(getApplicantState, state => state.loading);

export const getApplicantError = createSelector(getApplicantState, state => state.error);
