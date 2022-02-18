import { createSelector } from '@ngrx/store';
import { getCamfilPwaState } from 'camfil-pwa/store/camfil-pwa-store';

const getCamfilUserState = createSelector(getCamfilPwaState, state => state.camfilUser);

export const getCamfilUserReminderSuccess = createSelector(getCamfilUserState, state => state.reminderSuccess);

export const getCamfilUserReminderError = createSelector(getCamfilUserState, state => state.reminderError);

export const getCamfilUserLoading = createSelector(getCamfilUserState, state => state.loading);

export const getCamfilUserError = createSelector(getCamfilUserState, state => state.error);

export const getCamfilUserApplicant = createSelector(getCamfilUserState, state => state.applicant);

export const getCamfilUserPreferredTitles = createSelector(getCamfilUserState, state => state.preferredTitles);
