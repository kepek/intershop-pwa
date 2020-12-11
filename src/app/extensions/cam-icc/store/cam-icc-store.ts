import { createFeatureSelector } from '@ngrx/store';

import { ICCState } from './icc/icc.reducer';

export interface CamIccState {
  _icc: ICCState;
}

export const getCamIccState = createFeatureSelector<CamIccState>('camIcc');
