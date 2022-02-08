import { createSelector } from '@ngrx/store';

import { getCamRequisitionManagementState } from '../cam-requisition-management-store';

import { initialState, requisitionsAdapter } from './requisitions.reducer';

const getRequisitionsState = createSelector(getCamRequisitionManagementState, state =>
  state ? state?.requisitions : initialState
);

export const getRequisitionsLoading = createSelector(getRequisitionsState, state => state?.loading);

export const getRequisitionsError = createSelector(getRequisitionsState, state => state?.error);

// const getRequisitionsFilters = createSelector(getRequisitionsState, state => state?.filters);

export const { selectEntities, selectAll } = requisitionsAdapter.getSelectors(getRequisitionsState);

export const getRequisitions = selectAll;

export const getRequisition = (id: string) => createSelector(selectEntities, requisitions => requisitions[id]);
