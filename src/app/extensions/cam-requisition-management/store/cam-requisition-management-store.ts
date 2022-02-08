import { createFeatureSelector } from '@ngrx/store';

import { RequisitionsState } from './requisitions/requisitions.reducer';

export interface CamRequisitionManagementState {
  requisitions: RequisitionsState;
}

export const getCamRequisitionManagementState = createFeatureSelector<CamRequisitionManagementState>(
  'camRequisitionManagement'
);
