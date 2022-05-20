import { createAction } from '@ngrx/store';
import { CamCardItemComment, CamCardMeasurement } from 'src/app/extensions/cam-cards/models/cam-card/cam-card.model';

import { Address } from 'ish-core/models/address/address.model';
import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { httpError, payload } from 'ish-core/utils/ngrx-creators';

import {
  CamfilRequisition,
  CamfilRequisitionLineItemUpdate,
  CamfilRequisitionStatus,
  CamfilRequisitionViewer,
} from '../../models/camfil-requisition/camfil-requisition.model';

export const loadCamfilRequisitions = createAction(
  '[Camfil Requisitions] Load Requisitions',
  payload<{ view?: CamfilRequisitionViewer }>()
);

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
    requisitionId: string;
    item: { sku: string; quantity: number; boxLabel?: CamCardItemComment; measurements?: CamCardMeasurement };
  }>()
);

export const addProductToCamfilRequisitionFail = createAction(
  '[Camfil Requisitions API] Add Product To Requisition Fail',
  httpError()
);

export const addProductToCamfilRequisitionSuccess = createAction(
  '[Camfil Requisitions API] Add Product To Requisition Success',
  payload<{
    requisitionId: string;
  }>()
);

// Deleting products from requisition

export const removeProductFromCamfilRequisition = createAction(
  '[Camfil Requisitions API] Remove Line Item From Requisition',
  payload<{
    lineItemId: string;
    requisitionId?: string;
  }>()
);

export const removeProductFromCamfilRequisitionSuccess = createAction(
  '[Camfil Requisitions API] Remove Line Item From Requisition Success',
  payload<{ requisitionId: string }>()
);

export const removeProductFromCamfilRequisitionFail = createAction(
  '[Camfil Requisitions API] Remove  Line Item Requisition Fail',
  httpError()
);

export const removeMultipleProductsFromCamfilRequisition = createAction(
  '[Camfil Requisitions API] Remove Multiple Line Items From Requisition',
  payload<{
    lineItemsIds: string[];
    requisitionId?: string;
  }>()
);

export const removeMultipleProductsFromCamfilRequisitionSuccess = createAction(
  '[Camfil Requisitions API] Remove Multiple Line Items From Requisition Success',
  payload<{ requisitionId: string }>()
);

export const removeMultipleProductsFromCamfilRequisitionFail = createAction(
  '[Camfil Requisitions API] Remove Multiple Line Items From Requisition Fail',
  httpError()
);

// Requisition Update

export const updateCamfilRequisition = createAction(
  '[Camfil Requisitions API] Update Requisition',
  payload<{
    requisition: CamfilRequisition;
    addressId?: string;
    address?: Address;
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

// Address update
export const updateCamfilRequisitionAddress = createAction(
  '[Camfil Requisitions API] Update Requisition Address',
  payload<{ requisition: CamfilRequisition; address: Address }>()
);

export const updateCamfilRequisitionAddressSuccess = createAction(
  '[Camfil Requisitions API] Update Requisition Address Success',
  payload<{ requisition: CamfilRequisition; address: Address }>()
);

export const updateCamfilRequisitionAddressFail = createAction(
  '[Camfil Requisitions API] Update Requisition Address  Fail',
  httpError()
);

// Requisition Creation

export const createCamfilRequisition = createAction('[Camfil Requisitions API] Create Requisition');

export const createCamfilRequisitionFail = createAction(
  '[Camfil Requisitions API] Create Requisition Fail',
  httpError()
);

export const createCamfilRequisitionSuccess = createAction(
  '[Camfil Requisitions API] Create Requisition Success',
  payload<{ requisition: CamfilRequisition }>()
);

export const checkProductAvailabilityFail = createAction('[Camfil Requisitions API] Check Product Availability Fail');

// --------- Line items attributes ---------
export const addCamfilRequisitionLineItemAttribute = createAction(
  '[Camfil Requisitions API]  Add Attributes for selected line item ',
  payload<{ requisitionId: string; lineItemId: string; lineItemAttribute: Attribute }>()
);

export const addCamfilRequisitionLineItemAttributeFail = createAction(
  '[Camfil Requisitions API]  Add Attributes for selected line item Fail',
  httpError()
);

export const addCamfilRequisitionLineItemAttributeSuccess = createAction(
  '[Camfil Requisitions API]  Add Attributes for selected line item Success',
  payload<{ requisitionId: string; lineItemId: string; attribute: Attribute }>()
);

// Update Line Item Attribute
export const updateCamfilRequisitionLineItemAttribute = createAction(
  '[Camfil Requisitions API] Update Line Item Atrtibute',
  payload<{
    requisitionId?: string;
    lineItemId: string;
    lineItemAttribute: Attribute;
  }>()
);

export const updateCamfilRequisitionLineItemAttributeSuccess = createAction(
  '[Camfil Requisitions API] Update Line Item Atrtibutes Success'
);

export const updateCamfilRequisitionLineItemAttributeFail = createAction(
  '[Camfil Requisitions API] Update Line Item Atrtibutes Fail',
  httpError()
);

// Delete Line Item Attribute
export const deleteCamfilRequisitionLineItemAttribute = createAction(
  '[Camfil Requisitions API] Delete Attributes for selected line item ',
  payload<{ requisitionId: string; lineItemId: string; lineItemAttribute: Attribute }>()
);

export const deleteCamfilRequisitionLineItemAttributeFail = createAction(
  '[Camfil Requisitions API] Delete Attributes for selected line item Fail',
  httpError()
);

export const deleteCamfilRequisitionLineItemAttributeSuccess = createAction(
  '[Camfil Requisitions API] Delete Attributes for selected line item Success'
);

// Approve Line Items

export const approveCamfilRequisitionLineItems = createAction(
  '[Camfil Requisitions API] Approve Line Items Atrtibute',
  payload<{
    requisitionId?: string;
    lineItemIds: string[];
    requisition: CamfilRequisition;
  }>()
);

export const approveCamfilRequisitionLineItemsSuccess = createAction(
  '[Camfil Requisitions API] Approve Line Items Success',
  payload<{
    requisition: CamfilRequisition;
    lineItemIds: string[];
  }>()
);

export const approveCamfilRequisitionLineItemsFail = createAction(
  '[Camfil Requisitions API] Approve Line Items Fail',
  httpError()
);

// Quantity update for Line items

export const updateCamfilRequisitionLineItem = createAction(
  '[Camfil Requisitions API] Update Line Item ',
  payload<{
    requisitionId: string;
    lineItemUpdate: CamfilRequisitionLineItemUpdate;
  }>()
);

export const updateCamfilRequisitionLineItemSuccess = createAction(
  '[Camfil Requisitions API] Update Line Item  Success',
  payload<{
    requisitionId: string;
    lineItemUpdate: CamfilRequisitionLineItemUpdate;
  }>()
);

export const updateCamfilRequisitionLineItemFail = createAction(
  '[Camfil Requisitions API] Update Line Item  Fail',
  httpError()
);

// Change status for multiple requisitions

export const updateMultipleCamfilRequisitionStatus = createAction(
  '[Camfil Requisitions] Update Multiple Requisition Status',
  payload<{ requisitionIds: string[]; status: CamfilRequisitionStatus; approvalComment?: string }>()
);

export const updateMultipleCamfileRequisitionStatusFail = createAction(
  '[Camfil Requisitions API] Update MultipleRequisition Status Fail',
  httpError()
);

export const updateMultipleCamfilRequisitionStatusSuccess = createAction(
  '[Camfil Requisitions API] Update Multiple Requisition Status Success',
  payload<{ requisition: CamfilRequisition; status: string }>()
);
