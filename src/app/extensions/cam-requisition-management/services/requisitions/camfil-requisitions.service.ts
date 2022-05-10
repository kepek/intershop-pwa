import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';

import { Address } from 'ish-core/models/address/address.model';
import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { ApiService } from 'ish-core/services/api/api.service';

import { CamfilRequisitionData } from '../../models/camfil-requisition/camfil-requisition.interface';
import { CamfilRequisitionMapper } from '../../models/camfil-requisition/camfil-requisition.mapper';
import {
  CamfilRequisition,
  CamfilRequisitionLineItemUpdate,
  CamfilRequisitionStatus,
  CamfilRequisitionViewer,
} from '../../models/camfil-requisition/camfil-requisition.model';

type RequisitionIncludeType =
  | 'invoiceToAddress'
  | 'commonShipToAddress'
  | 'commonShippingMethod'
  | 'discounts'
  | 'lineItems_discounts'
  | 'lineItems'
  | 'payments'
  | 'payments_paymentMethod'
  | 'payments_paymentInstrument';

@Injectable({ providedIn: 'root' })
export class CamfilRequisitionsService {
  constructor(private apiService: ApiService) {}

  private allIncludes: RequisitionIncludeType[] = [
    'invoiceToAddress',
    'commonShipToAddress',
    'commonShippingMethod',
    'discounts',
    'lineItems_discounts',
    'lineItems',
    'payments',
    'payments_paymentMethod',
    'payments_paymentInstrument',
  ];

  /**
   * Get all customer requisitions of a certain status and view. The current user is expected to have the approver permission.
   * @param  view    Defines whether the 'buyer' or 'approver' view is returned. Default: 'buyer'
   * @param  status  Approval status filter. Default: All requisitions are returned
   * @returns        Requisitions of the customer with their main attributes. To get all properties the getCamfilRequisition call is needed.
   */
  getCamfilRequisitions(view?: CamfilRequisitionViewer): Observable<CamfilRequisition[]> {
    let params = new HttpParams();
    if (view) {
      params = params.set('view', view);
    }
    return this.apiService
      .get(`camfilrequisitions`, { params })
      .pipe(map(CamfilRequisitionMapper.fromElemenetsToListData), map(CamfilRequisitionMapper.fromListData));
  }

  /**
   * Get a customer requisition of a certain id. The current user is expected to have the approver permission.
   * @param  id      Requisition id.
   * @returns        Requisition with all attributes. If the requisition is approved and the order is placed, also order data are returned as part of the requisition.
   */
  getCamfilRequisition(requisitionId: string): Observable<CamfilRequisition> {
    if (!requisitionId) {
      return throwError('getCamfilRequisition() called without required id');
    }

    const params = new HttpParams().set('include', this.allIncludes.join());

    return this.apiService
      .get<CamfilRequisitionData>(`camfilrequisitions/${requisitionId}`, {
        params,
      })
      .pipe(map(payload => CamfilRequisitionMapper.fromData(payload)));
  }

  /**
   * Updates the requisition status. The current user is expected to have the approver permission.
   * @param id          Requisition id.
   * @param statusCode  The requisition approval status
   * @param comment     The approval comment
   * @returns           The updated requisition with all attributes. If the requisition is approved and the order is placed, also order data are returned as part of the requisition.
   */
  updateCamfilRequisitionStatus(
    requisitionId: string,
    statusCode: CamfilRequisitionStatus,
    approvalComment?: string
  ): Observable<CamfilRequisition> {
    if (!requisitionId) {
      return throwError('updateCamfilRequisitionStatus() called without required id');
    }
    if (!statusCode) {
      return throwError('updateCamfilRequisitionStatus() called without required requisition status');
    }

    const params = new HttpParams().set('include', this.allIncludes.join());
    const body = {
      name: 'string',
      type: 'ApprovalStatusChange',
      statusCode,
      approvalComment,
    };

    const type = statusCode === 'APPROVED' ? 'approve' : 'reject';

    return this.apiService
      .patch<CamfilRequisitionData>(`camfilrequisitions/${requisitionId}/${type}`, body, {
        params,
      })
      .pipe(map(payload => CamfilRequisitionMapper.fromData(payload)));
  }

  /**
   * Updates the requisition status. The current user is expected to have the approver permission.
   * @param id          Requisition id.
   * @returns           The updated requisition with all attributes. If the requisition is approved and the order is placed, also order data are returned as part of the requisition.
   */
  createOrderFromApprovedRequisition(requisitionId: string, lineItemIds?: string[]): Observable<CamfilRequisition> {
    if (!requisitionId) {
      return throwError('createOrderFromApprovedRequisition() called without required id');
    }
    const params = new HttpParams().set('include', this.allIncludes.join());
    const body = {
      termsAndConditionsAccepted: true,
      lineItemIds,
    };

    return this.apiService
      .post<CamfilRequisitionData>(`camfilrequisitions/${requisitionId}/create-order`, body, {
        params,
      })
      .pipe(concatMap(payload => CamfilRequisitionMapper.fromListData(payload)));
  }

  // Add product to requisition

  addProductToCamfilRequisition(requisitionId: string, item: { sku: string; quantity: number }): Observable<string> {
    if (!requisitionId) {
      return throwError('addProductToCamfilRequisition() called without required id');
    }

    if (!item) {
      return throwError('removeProductsFromCamfilRequisition() called without required item');
    }

    const elements = [{ sku: item.sku, quantity: { value: item.quantity, unit: '' } }];
    const body = {
      elements,
    };

    return this.apiService
      .post<string>(`camfilrequisitions/${requisitionId}/items`, body)
      .pipe(map(() => requisitionId));
  }

  // Remove product from requisition
  removeProductsFromCamfilRequisition(lineItemId: string, requisitionId?: string): Observable<string> {
    if (!requisitionId) {
      return throwError('removeProductsFromCamfilRequisition() called without required requisitionId');
    }

    if (!lineItemId) {
      return throwError('removeProductsFromCamfilRequisition() called without required lineItemId');
    }

    return this.apiService
      .delete<string>(`camfilrequisitions/${requisitionId}/items/${lineItemId}`)
      .pipe(map(() => requisitionId));
  }

  addLineItemAttribute(requisitionId: string, lineItemId: string, attribute: Attribute) {
    if (!requisitionId) {
      return throwError('addLineItemAttribute() called without required id');
    }

    if (!lineItemId) {
      return throwError('addLineItemAttribute() called without required line item id');
    }

    const params = new HttpParams().set('include', this.allIncludes.join());
    const body = {
      lineItemId,
      attribute,
    };
    return this.apiService
      .patch(`camfilrequisitions/${requisitionId}/items/attributes/`, body, {
        params,
      })
      .pipe(map(() => ({ requisitionId, lineItemId, attribute })));
  }

  updateLineItemAttribute(requisitionId: string, lineItemId: string, attribute: Attribute) {
    if (!requisitionId) {
      return throwError('updateLineItemAttribute() called without required id');
    }

    const params = new HttpParams().set('include', this.allIncludes.join());
    const body = {
      lineItemId,
      attribute,
    };
    return this.apiService
      .patch(`camfilrequisitions/${requisitionId}/items/attributes/`, body, {
        params,
      })
      .pipe(map(() => ({ requisitionId, lineItemId, attribute })));
  }

  updateLineItem(requisitionId: string, lineItemUpdate: CamfilRequisitionLineItemUpdate) {
    if (!requisitionId) {
      return throwError('updateLineItem() called without required requisition id');
    }

    const params = new HttpParams().set('include', this.allIncludes.join());
    const body = {
      quantity: { value: lineItemUpdate.quantity },
    };
    return this.apiService
      .put(`camfilrequisitions/${requisitionId}/items/${lineItemUpdate.lineItemId}`, body, {
        params,
      })
      .pipe(map(() => ({ requisitionId, lineItemUpdate })));
  }

  updateCamfilRequisition(requisition: CamfilRequisition): Observable<CamfilRequisition> {
    const params = new HttpParams().set('include', this.allIncludes.join());
    const body = {
      ...requisition,
    };

    return this.apiService
      .patch(`camfilrequisitions/${requisition.id}`, body, {
        params,
      })
      .pipe(map(() => requisition));
  }

  updateCamfilRequisitionAddress(requisitionId: string, address: Address): Observable<Address> {
    const params = new HttpParams().set('include', this.allIncludes.join());
    const body = {
      ...address,
    };

    return this.apiService
      .patch<Address>(`camfilrequisitions/${requisitionId}/addresses/${address.id}`, body, {
        params,
      })
      .pipe(map(() => address));
  }

  createCamfilRequisition(basketId: string): Observable<CamfilRequisition> {
    const params = new HttpParams().set('include', this.allIncludes.join());

    if (!basketId) {
      return throwError('createCamfilRequisition() called without basketId');
    }

    const body = {
      basketID: basketId,
    };
    return this.apiService
      .post<CamfilRequisitionData>(`camfilrequisitions`, body, {
        params,
      })
      .pipe(concatMap(payload => CamfilRequisitionMapper.fromListData(payload)));
  }

  approveSelectedLineItems(
    requisitionId: string,
    lineItemIds: string[],
    requisition: CamfilRequisition
  ): Observable<CamfilRequisition> {
    if (!requisitionId) {
      return throwError('updateLineItem() called without required requisition id');
    }

    const params = new HttpParams().set('include', this.allIncludes.join());
    const body = {
      ...requisition,
      lineItemIds,
    };
    return this.apiService
      .patch(`camfilrequisitions/${requisitionId}/approve`, body, {
        params,
      })
      .pipe(map(() => requisition));
  }
}
