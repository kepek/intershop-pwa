import { createSelector } from '@ngrx/store';

import { getCamAccountState } from '../cam-account-store';

/* Applicant */

const getApplicantState = createSelector(getCamAccountState, state => state.applicant);

export const getApplicant = createSelector(getApplicantState, state => state.applicant);

export const getApplicantLoading = createSelector(getApplicantState, state => state.loading);

export const getApplicantError = createSelector(getApplicantState, state => state.error);
