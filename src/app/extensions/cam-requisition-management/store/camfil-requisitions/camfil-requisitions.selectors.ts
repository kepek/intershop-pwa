import { createSelector } from '@ngrx/store';
import { CamfilRequisition } from '../../models/camfil-requisition/camfil-requisition.model';

import { getCamRequisitionManagementState } from '../cam-requisition-management-store';

import { camfilRequisitionsAdapter, initialState } from './camfil-requisitions.reducer';

const getCamfilRequisitionsState = createSelector(getCamRequisitionManagementState, state =>
  state ? state?.requisitions : initialState
);

export const getCamfilRequisitionsLoading = createSelector(getCamfilRequisitionsState, state => state?.loading);

export const getCamfilRequisitionsError = createSelector(getCamfilRequisitionsState, state => state?.error);

// const getCamfilRequisitionsFilters = createSelector(getCamfilRequisitionsState, state => state?.filters);

export const { selectEntities, selectAll } = camfilRequisitionsAdapter.getSelectors(getCamfilRequisitionsState);

export const getCamfilRequisitions = selectAll;

export const getCamfilRequisition = (id: string) => createSelector(selectEntities, requisitions => requisitions[id]);

export const getSelectedCamfilRequisitionId = createSelector(
  getCamfilRequisitionsState,
  state => state.selectedCamfilRequisition
);

export const getSelectedCamfilRequisition = createSelector(
  selectEntities,
  getSelectedCamfilRequisitionId,
  (entities, id): CamfilRequisition => id && entities[id]
);
