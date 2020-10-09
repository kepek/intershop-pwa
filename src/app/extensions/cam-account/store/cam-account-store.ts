import { createFeatureSelector } from '@ngrx/store';

import { ApplicantState } from './applicant/applicant.reducer';

export interface CamAccountState {
  applicant: ApplicantState;
}

export const getCamAccountState = createFeatureSelector<CamAccountState>('camAccount');
