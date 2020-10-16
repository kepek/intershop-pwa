import { createFeatureSelector } from '@ngrx/store';

import { ApplicantState } from './applicant/applicant.reducer';
import { UserState } from './user/user.reducer';

export interface CamAccountState {
  applicant: ApplicantState;
  user: UserState;
}

export const getCamAccountState = createFeatureSelector<CamAccountState>('camAccount');
