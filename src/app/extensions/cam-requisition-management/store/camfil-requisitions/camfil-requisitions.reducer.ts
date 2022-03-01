import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { setErrorOn, setLoadingOn, unsetLoadingAndErrorOn } from 'ish-core/utils/ngrx-creators';

import { CamfilRequisition } from '../../models/camfil-requisition/camfil-requisition.model';

import {
  addProductToCamfilRequisitionSuccess,
  createCamfilRequisition,
  createCamfilRequisitionFail,
  createCamfilRequisitionSuccess,
  createOrderFromApprovedRequisitionFail,
  createOrderFromApprovedRequisitionSuccess,
  loadCamfilRequisition,
  loadCamfilRequisitionFail,
  loadCamfilRequisitions,
  loadCamfilRequisitionsFail,
  loadCamfilRequisitionsSuccess,
  loadCamfilRequisitionsuccess,
  updateCamfilRequisitionFail,
  updateCamfilRequisitionStatus,
  updateCamfilRequisitionStatusFail,
  updateCamfilRequisitionStatusSuccess,
  updateCamfilRequisitionSuccess,
} from './camfil-requisitions.actions';

export const camfilRequisitionsAdapter = createEntityAdapter<CamfilRequisition>();

export interface CamfilRequisitionsState extends EntityState<CamfilRequisition> {
  loading: boolean;
  error: HttpError;
  filters: {
    buyerPENDING: string[];
    buyerAPPROVED: string[];
    buyerREJECTED: string[];
    approverPENDING: string[];
    approverAPPROVED: string[];
    approverREJECTED: string[];
  };
}

export const initialState: CamfilRequisitionsState = camfilRequisitionsAdapter.getInitialState({
  loading: false,
  error: undefined,
  filters: {
    buyerPENDING: [],
    buyerAPPROVED: [],
    buyerREJECTED: [],
    approverPENDING: [],
    approverAPPROVED: [],
    approverREJECTED: [],
  },
});

export const requisitionsReducer = createReducer(
  initialState,
  setLoadingOn(loadCamfilRequisitions, loadCamfilRequisition, updateCamfilRequisitionStatus, createCamfilRequisition),
  unsetLoadingAndErrorOn(
    loadCamfilRequisitionsSuccess,
    loadCamfilRequisitionsuccess,
    updateCamfilRequisitionStatusSuccess,
    createCamfilRequisitionSuccess,
    createOrderFromApprovedRequisitionSuccess
  ),
  setErrorOn(
    loadCamfilRequisitionsFail,
    loadCamfilRequisitionFail,
    updateCamfilRequisitionStatusFail,
    updateCamfilRequisitionFail,
    createCamfilRequisitionFail,
    createOrderFromApprovedRequisitionFail
  ),
  on(loadCamfilRequisitionsSuccess, (state: CamfilRequisitionsState, action) =>
    camfilRequisitionsAdapter.upsertMany(action.payload.requisitions, {
      ...state,
      filters: {
        ...state.filters,
        [action.payload.view + action.payload.status]: action.payload.requisitions.map(requisition => requisition.id),
      },
    })
  ),
  on(loadCamfilRequisitionsuccess, (state: CamfilRequisitionsState, action) =>
    camfilRequisitionsAdapter.upsertOne(action.payload.requisition, state)
  ),
  on(
    updateCamfilRequisitionStatusSuccess,
    createOrderFromApprovedRequisitionSuccess,
    (state: CamfilRequisitionsState, action) => {
      const { requisition } = action.payload;
      const { approval } = requisition;
      const approvedRequisition = {
        ...state.entities[requisition?.id],
        approval: approval,
      };

      return camfilRequisitionsAdapter.upsertOne(approvedRequisition, state);
    }
  ),
  on(
    addProductToCamfilRequisitionSuccess,
    updateCamfilRequisitionSuccess,
    createCamfilRequisitionSuccess,
    (state: CamfilRequisitionsState, action) => camfilRequisitionsAdapter.upsertOne(action.payload.requisition, state)
  )
);
