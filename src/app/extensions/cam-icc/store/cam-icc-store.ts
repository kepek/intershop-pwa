import { createFeatureSelector } from '@ngrx/store';

import { ICCState } from './icc/icc.reducer';

export interface CamIccState {
  icc: ICCState;
}

export const getCamIccState = createFeatureSelector<CamIccState>('camIcc');
