import { createFeatureSelector } from '@ngrx/store';

import { ApplicantState } from './applicant/applicant.reducer';

export interface CamUserState {
  applicant: ApplicantState;
}

export const getCamUserState = createFeatureSelector<CamUserState>('camUser');
