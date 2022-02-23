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
    createCamfilRequisitionSuccess
  ),
  setErrorOn(
    loadCamfilRequisitionsFail,
    loadCamfilRequisitionFail,
    updateCamfilRequisitionStatusFail,
    updateCamfilRequisitionFail,
    createCamfilRequisitionFail
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
  on(loadCamfilRequisitionsuccess, updateCamfilRequisitionStatusSuccess, (state: CamfilRequisitionsState, action) =>
    camfilRequisitionsAdapter.upsertOne(action.payload.requisition, state)
  ),
  on(
    addProductToCamfilRequisitionSuccess,
    updateCamfilRequisitionSuccess,
    createCamfilRequisitionSuccess,
    (state: CamfilRequisitionsState, action) => camfilRequisitionsAdapter.upsertOne(action.payload.requisition, state)
  )
);
