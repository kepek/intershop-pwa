import { createFeatureSelector } from '@ngrx/store';

import { CamfilRequisitionsState } from './camfil-requisitions/camfil-requisitions.reducer';

export interface CamRequisitionManagementState {
  requisitions: CamfilRequisitionsState;
}

export const getCamRequisitionManagementState = createFeatureSelector<CamRequisitionManagementState>(
  'camRequisitionManagement'
);
