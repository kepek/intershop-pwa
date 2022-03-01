import { createAction } from '@ngrx/store';

import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { httpError, payload } from 'ish-core/utils/ngrx-creators';

import {
  CamfilRequisition,
  CamfilRequisitionStatus,
  CamfilRequisitionViewer,
} from '../../models/camfil-requisition/camfil-requisition.model';

export const loadCamfilRequisitions = createAction('[Camfil Requisitions] Load Requisitions');

export const loadCamfilRequisitionsFail = createAction('[Camfil Requisitions API] Load Requisitions Fail', httpError());

export const loadCamfilRequisitionsSuccess = createAction(
  '[Camfil Requisitions API] Load Requisitions Success',
  payload<{
    requisitions: CamfilRequisition[];
    view?: CamfilRequisitionViewer;
    status?: CamfilRequisitionStatus;
  }>()
);

export const loadCamfilRequisition = createAction(
  '[Camfil Requisitions] Load Requisition',
  payload<{ requisitionId: string }>()
);

export const loadCamfilRequisitionFail = createAction('[Camfil Requisitions API] Load Requisition Fail', httpError());

export const loadCamfilRequisitionsuccess = createAction(
  '[Camfil Requisitions API] Load Requisition Success',
  payload<{ requisition: CamfilRequisition }>()
);

export const getCamfilRequisitionData = createAction(
  '[Camfil Requisitions] Get Requisition',
  payload<{ requisitionId: string }>()
);

export const updateCamfilRequisitionStatus = createAction(
  '[Camfil Requisitions] Update Requisition Status',
  payload<{ requisitionId: string; status: CamfilRequisitionStatus; approvalComment?: string }>()
);

export const updateCamfilRequisitionStatusFail = createAction(
  '[Camfil Requisitions API] Update Requisition Status Fail',
  httpError()
);

export const updateCamfilRequisitionStatusSuccess = createAction(
  '[Camfil Requisitions API] Update Requisition Status Success',
  payload<{ requisition: CamfilRequisition; status: string }>()
);

export const createOrderFromApprovedRequisition = createAction(
  '[Camfil Requisitions API] Create Order From Approved Requisition',
  payload<{ requisitionId: string }>()
);

export const createOrderFromApprovedRequisitionSuccess = createAction(
  '[Camfil Requisitions API] Create Order From Approved Requisition Success',
  payload<{ requisition: CamfilRequisition }>()
);

export const createOrderFromApprovedRequisitionFail = createAction(
  '[Camfil Requisitions API] Create Order From Approved Requisition Fail',
  httpError()
);

export const addProductToCamfilRequisition = createAction(
  '[Camfil Requisitions API] Add Product To Requisition',
  payload<{
    sku: string;
    quantity: number;
    requisitionId?: string;
  }>()
);

export const addProductToCamfilRequisitionFail = createAction(
  '[Camfil Requisitions API] Add Product To Requisition Fail'
);

export const addProductToCamfilRequisitionSuccess = createAction(
  '[Camfil Requisitions API] Add Product To Requisition Success',
  payload<{ requisition: CamfilRequisition }>()
);

export const removeProductsFromCamfilRequisition = createAction(
  '[Camfil Requisitions API] Remove Line Items From Requisition',
  payload<{
    lineItemIds: string[];
    requisitionId?: string;
  }>()
);

export const removeProductsFromCamfilRequisitionSuccess = createAction(
  '[Camfil Requisitions API] Remove Line Items From Requisition Success',
  payload<{ requisition: CamfilRequisition }>()
);

export const updateCamfilRequisitionLineItemAttribute = createAction(
  '[Camfil Requisitions API] Approve Line Items',
  payload<{
    lineItemIds: string[];
    requisitionId?: string;
    lineItemAttribute: Attribute;
  }>()
);

export const updateCamfilRequisitionLineItemAttributeSuccess = createAction(
  '[Camfil Requisitions API] Approve Line Items Success'
);

export const updateCamfilRequisitionLineItemAttributeFail = createAction(
  '[Camfil Requisitions API] Approve Line Items Fail',
  httpError()
);

export const updateCamfilRequisition = createAction(
  '[Camfil Requisitions API] Update Requisition',
  payload<{
    requisition: CamfilRequisition;
  }>()
);

export const updateCamfilRequisitionSuccess = createAction(
  '[Camfil Requisitions API] Update Requisition Success',
  payload<{ requisition: CamfilRequisition }>()
);

export const updateCamfilRequisitionFail = createAction(
  '[Camfil Requisitions API] Update Requisition Fail',
  httpError()
);

export const createCamfilRequisition = createAction('[Camfil Requisitions API] Create Requisition');

export const createCamfilRequisitionFail = createAction(
  '[Camfil Requisitions API] Create Requisition Fail',
  httpError()
);

export const createCamfilRequisitionSuccess = createAction(
  '[Camfil Requisitions API] Create Requisition Success',
  payload<{ requisition: CamfilRequisition }>()
);
