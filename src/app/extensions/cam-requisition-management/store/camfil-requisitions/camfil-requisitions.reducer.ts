import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { setErrorOn, setLoadingOn, unsetLoadingAndErrorOn } from 'ish-core/utils/ngrx-creators';

import { CamfilRequisition } from '../../models/camfil-requisition/camfil-requisition.model';

import {
  approveCamfilRequisitionLineItems,
  approveCamfilRequisitionLineItemsSuccess,
  checkProductAvailabilityFail,
  createCamfilRequisition,
  createCamfilRequisitionFail,
  createCamfilRequisitionSuccess,
  createOrderFromApprovedRequisitionFail,
  createOrderFromApprovedRequisitionSuccess,
  getCamfilRequisitionData,
  loadCamfilRequisition,
  loadCamfilRequisitionFail,
  loadCamfilRequisitions,
  loadCamfilRequisitionsFail,
  loadCamfilRequisitionsSuccess,
  loadCamfilRequisitionsuccess,
  updateCamfilRequisition,
  updateCamfilRequisitionAddress,
  updateCamfilRequisitionAddressSuccess,
  updateCamfilRequisitionFail,
  updateCamfilRequisitionLineItem,
  updateCamfilRequisitionLineItemFail,
  updateCamfilRequisitionLineItemSuccess,
  updateCamfilRequisitionStatus,
  updateCamfilRequisitionStatusFail,
  updateCamfilRequisitionStatusSuccess,
  updateCamfilRequisitionSuccess,
  updateMultipleCamfilRequisitionStatus,
  updateMultipleCamfilRequisitionStatusSuccess,
  updateMultipleCamfileRequisitionStatusFail,
} from './camfil-requisitions.actions';

export const camfilRequisitionsAdapter = createEntityAdapter<CamfilRequisition>();

export interface CamfilRequisitionsState extends EntityState<CamfilRequisition> {
  loading: boolean;
  selectedCamfilRequisition: string;
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
  selectedCamfilRequisition: undefined,
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
  setLoadingOn(
    loadCamfilRequisitions,
    loadCamfilRequisition,
    updateCamfilRequisitionStatus,
    updateMultipleCamfilRequisitionStatus,
    createCamfilRequisition,
    updateCamfilRequisition,
    updateCamfilRequisitionLineItem,
    updateCamfilRequisitionAddress
  ),
  unsetLoadingAndErrorOn(
    loadCamfilRequisitionsSuccess,
    loadCamfilRequisitionsuccess,
    updateCamfilRequisitionStatusSuccess,
    updateMultipleCamfilRequisitionStatusSuccess,
    createCamfilRequisitionSuccess,
    createOrderFromApprovedRequisitionSuccess,
    updateCamfilRequisitionSuccess,
    updateCamfilRequisitionAddressSuccess,
    updateCamfilRequisitionLineItemSuccess
  ),
  setErrorOn(
    loadCamfilRequisitionsFail,
    loadCamfilRequisitionFail,
    updateCamfilRequisitionStatusFail,
    updateMultipleCamfileRequisitionStatusFail,
    updateCamfilRequisitionFail,
    createCamfilRequisitionFail,
    createOrderFromApprovedRequisitionFail,
    checkProductAvailabilityFail,
    updateCamfilRequisitionLineItemFail
  ),
  on(getCamfilRequisitionData, (state: CamfilRequisitionsState, action) => ({
    ...state,
    selectedCamfilRequisition: action.payload.requisitionId,
  })),
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
        approval,
      };

      return camfilRequisitionsAdapter.upsertOne(approvedRequisition, state);
    }
  ),
  on(updateCamfilRequisitionSuccess, createCamfilRequisitionSuccess, (state: CamfilRequisitionsState, action) =>
    camfilRequisitionsAdapter.upsertOne(action.payload.requisition, state)
  ),
  on(updateCamfilRequisitionAddressSuccess, (state: CamfilRequisitionsState, action) => {
    const { requisition, address } = action.payload;

    const updatedRequisition = {
      ...requisition,
      shippingAddress: address,
    };

    return camfilRequisitionsAdapter.upsertOne(updatedRequisition, state);
  }),
  on(updateCamfilRequisitionLineItemSuccess, (state: CamfilRequisitionsState, action) => {
    const { requisitionId, lineItemUpdate } = action.payload;
    const updateLineItems = state.entities[requisitionId].lineItems.map(lineItem =>
      lineItem.id === lineItemUpdate.lineItemId
        ? {
            ...lineItem,
            quantity: {
              value: lineItemUpdate.quantity,
            },
          }
        : lineItem
    );

    const updatedRequisition = {
      ...state.entities[requisitionId],
      lineItems: updateLineItems,
    };

    return camfilRequisitionsAdapter.upsertOne(updatedRequisition, state);
  }),
  on(approveCamfilRequisitionLineItems, (state: CamfilRequisitionsState, action) => {
    const { requisition } = action.payload;
    const updatedRequisition = {
      ...requisition,
      partiallyApproved: false,
    };
    return camfilRequisitionsAdapter.upsertOne(updatedRequisition, state);
  }),
  on(approveCamfilRequisitionLineItemsSuccess, (state: CamfilRequisitionsState, action) => {
    const { requisition } = action.payload;
    const updatedRequisition = {
      ...requisition,
      partiallyApproved: true,
    };
    return camfilRequisitionsAdapter.upsertOne(updatedRequisition, state);
  }),
  // TODO: Update with upsert many
  on(updateMultipleCamfilRequisitionStatusSuccess, (state: CamfilRequisitionsState, action) => {
    const { requisition } = action.payload;
    const { approval } = requisition;
    const approvedRequisition = {
      ...state.entities[requisition?.id],
      approval,
    };

    return camfilRequisitionsAdapter.upsertOne(approvedRequisition, state);
  })
);
