import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';

import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { OrderData } from 'ish-core/models/order/order.interface';
import { ApiService } from 'ish-core/services/api/api.service';

import { CamfilRequisitionData } from '../../models/camfil-requisition/camfil-requisition.interface';
import { CamfilRequisitionMapper } from '../../models/camfil-requisition/camfil-requisition.mapper';
import {
  CamfilRequisition,
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

  private orderHeaders = new HttpHeaders({
    'content-type': 'application/json',
    Accept: 'application/vnd.intershop.order.v1+json',
  });

  /**
   * Get all customer requisitions of a certain status and view. The current user is expected to have the approver permission.
   * @param  view    Defines whether the 'buyer' or 'approver' view is returned. Default: 'buyer'
   * @param  status  Approval status filter. Default: All requisitions are returned
   * @returns        Requisitions of the customer with their main attributes. To get all properties the getCamfilRequisition call is needed.
   */
  getCamfilRequisitions(
    view?: CamfilRequisitionViewer,
    status?: CamfilRequisitionStatus
  ): Observable<CamfilRequisition[]> {
    let params = new HttpParams();
    if (view) {
      params = params.set('view', view);
    }
    if (status) {
      params = params.set('status', status);
    }

    return this.apiService
      .get(`camfilrequisitions`)
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
  createOrderFromApprovedRequisition(requisitionId: string): Observable<CamfilRequisition> {
    if (!requisitionId) {
      return throwError('createOrderFromApprovedRequisition() called without required id');
    }
    const params = new HttpParams().set('include', this.allIncludes.join());
    const body = {
      termsAndConditionsAccepted: true,
    };

    return this.apiService
      .post<CamfilRequisitionData>(`camfilrequisitions/${requisitionId}/create-order`, body, {
        params,
      })
      .pipe(concatMap(payload => CamfilRequisitionMapper.fromListData(payload)));
  }

  /**
   *  Gets the order data, if needed and maps the requisition/order data.
   * @param payload  The requisition row data returnedby the REST interface.
   * @returns        The requisition.
   */
  private processRequisitionData(payload: CamfilRequisitionData): Observable<CamfilRequisition> {
    const params = new HttpParams().set('include', this.allIncludes.join());

    if (!Array.isArray(payload.data)) {
      const requisitionData = payload.data;

      if (requisitionData.order?.itemId) {
        return this.apiService
          .get<OrderData>(`orders/${requisitionData.order.itemId}`, {
            headers: this.orderHeaders,
            params,
          })
          .pipe(map(() => CamfilRequisitionMapper.fromData(payload)));
      }
    }

    return of(CamfilRequisitionMapper.fromData(payload));
  }

  // Add product to requisition

  addProductToCamfilRequisition(sku: string, quantity: number, requisitionId?: string): Observable<CamfilRequisition> {
    if (!requisitionId) {
      return throwError('addProductToCamfilRequisition() called without required id');
    }

    const params = new HttpParams().set('include', this.allIncludes.join());
    const body = {
      name: 'string',
      type: 'addProductToCamfilRequisition',
      sku,
      quantity,
    };

    return this.apiService
      .b2bUserEndpoint()
      .patch<CamfilRequisitionData>(`requisitions/${requisitionId}`, body, {
        params,
      })
      .pipe(concatMap(payload => this.processRequisitionData(payload)));
  }

  // Remove products fromrequisition
  removeProductsFromCamfilRequisition(lineItemsIds: string[], requisitionId?: string): Observable<CamfilRequisition> {
    if (!requisitionId) {
      return throwError('removeProductsFromCamfilRequisition() called without required id');
    }

    const params = new HttpParams().set('include', this.allIncludes.join());
    const body = {
      name: 'string',
      type: 'removeProductsFromCamfilRequisition',
      lineItemsIds,
    };

    return this.apiService
      .b2bUserEndpoint()
      .patch<CamfilRequisitionData>(`requisitions/delete-line-items/${requisitionId}`, body, {
        params,
      })
      .pipe(concatMap(payload => this.processRequisitionData(payload)));
  }

  updateLineItemAttribute(requisitionId: string, lineItemsIds: string[], attribute: Attribute) {
    if (!requisitionId) {
      return throwError('updateLineItemAttribute() called without required id');
    }

    const params = new HttpParams().set('include', this.allIncludes.join());
    const body = {
      lineItemsIds,
      attribute,
    };
    return this.apiService
      .patch(`requisitions/${requisitionId}/items/attributes/`, body, {
        params,
      })
      .pipe(map(() => ({ requisitionId, lineItemsIds, attribute })));
  }

  updateCamfilRequisition(requisition: CamfilRequisition): Observable<CamfilRequisition> {
    const params = new HttpParams().set('include', this.allIncludes.join());
    const body = {
      requisition,
    };

    return this.apiService
      .patch(`requisitions/${requisition.id}`, body, {
        params,
      })
      .pipe(map(() => requisition));
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
}
