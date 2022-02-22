import { createAction } from '@ngrx/store';

import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { httpError, payload } from 'ish-core/utils/ngrx-creators';

import { Requisition, RequisitionStatus, RequisitionViewer } from '../../models/requisition/requisition.model';

export const loadRequisitions = createAction('[Camfil Requisitions] Load Requisitions');

export const loadRequisitionsFail = createAction('[Camfil Requisitions API] Load Requisitions Fail', httpError());

export const loadRequisitionsSuccess = createAction(
  '[Camfil Requisitions API] Load Requisitions Success',
  payload<{ requisitions: Requisition[]; view?: RequisitionViewer; status?: RequisitionStatus }>()
);

export const loadRequisition = createAction(
  '[Camfil Requisitions] Load Requisition',
  payload<{ requisitionId: string }>()
);

export const loadRequisitionFail = createAction('[Camfil Requisitions API] Load Requisition Fail', httpError());

export const loadRequisitionSuccess = createAction(
  '[Camfil Requisitions API] Load Requisition Success',
  payload<{ requisition: Requisition }>()
);

export const getRequisitionData = createAction(
  '[Camfil Requisitions] Get Requisition',
  payload<{ requisitionId: string }>()
);

export const updateRequisitionStatus = createAction(
  '[Camfil Requisitions] Update Requisition Status',
  payload<{ requisitionId: string; status: RequisitionStatus; approvalComment?: string }>()
);

export const updateRequisitionStatusFail = createAction(
  '[Camfil Requisitions API] Update Requisition Status Fail',
  httpError()
);

export const updateRequisitionStatusSuccess = createAction(
  '[Camfil Requisitions API] Update Requisition Status Success',
  payload<{ requisition: Requisition; requisitionStatus: string }>()
);

export const addProductToRequisition = createAction(
  '[Camfil Requisitions API] Add Product To Requisition',
  payload<{
    sku: string;
    quantity: number;
    requisitionId?: string;
  }>()
);

export const addProductToRequisitionFail = createAction('[Camfil Requisitions API] Add Product To Requisition Fail');

export const addProductToRequisitionSuccess = createAction(
  '[Camfil Requisitions API] Add Product To Requisition Success',
  payload<{ requisition: Requisition }>()
);

export const removeProductsFromRequisition = createAction(
  '[Camfil Requisitions API] Remove Line Items From Requisition',
  payload<{
    lineItemIds: string[];
    requisitionId?: string;
  }>()
);

export const removeProductsFromRequisitionSuccess = createAction(
  '[Camfil Requisitions API] Remove Line Items From Requisition Success',
  payload<{ requisition: Requisition }>()
);

export const updateRequisitionLineItemAttribute = createAction(
  '[Camfil Requisitions API] Approve Line Items',
  payload<{
    lineItemIds: string[];
    requisitionId?: string;
    lineItemAttribute: Attribute;
  }>()
);

export const updateRequisitionLineItemAttributeSuccess = createAction(
  '[Camfil Requisitions API] Approve Line Items Success'
);

export const updateRequisitionLineItemAttributeFail = createAction(
  '[Camfil Requisitions API] Approve Line Items Fail',
  httpError()
);

export const updateRequisition = createAction(
  '[Camfil Requisitions API] Update Requisition',
  payload<{
    requisition: Requisition;
  }>()
);

export const updateRequisitionSuccess = createAction(
  '[Camfil Requisitions API] Update Requisition Success',
  payload<{ requisition: Requisition }>()
);

export const updateRequisitionFail = createAction('[Camfil Requisitions API] Update Requisition Fail', httpError());

export const createRequisition = createAction('[Camfil Requisitions API] Create Requisition');

export const createRequisitionFail = createAction('[Camfil Requisitions API] Create Requisition Fail', httpError());

export const createRequisitionSuccess = createAction(
  '[Camfil Requisitions API] Create Requisition Success',
  payload<{ requisition: Requisition }>()
);
