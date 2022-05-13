import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { distinctUntilChanged, filter, map, sample, startWith, switchMap } from 'rxjs/operators';

import { Address } from 'ish-core/models/address/address.model';
import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { selectRouteParam, selectUrl } from 'ish-core/store/core/router';
import { whenTruthy } from 'ish-core/utils/operators';

import {
  CamfilRequisition,
  CamfilRequisitionLineItemUpdate,
  CamfilRequisitionViewer,
} from '../models/camfil-requisition/camfil-requisition.model';
import {
  addCamfilRequisitionLineItemAttribute,
  createCamfilRequisition,
  deleteCamfilRequisitionLineItemAttribute,
  getCamfilRequisition,
  getCamfilRequisitions,
  getCamfilRequisitionsError,
  getCamfilRequisitionsLoading,
  loadCamfilRequisition,
  loadCamfilRequisitions,
  updateCamfilRequisition,
  updateCamfilRequisitionLineItem,
  updateCamfilRequisitionLineItemAttribute,
  updateMultipleCamfilRequisitionStatus,
} from '../store/camfil-requisitions';

// tslint:disable:member-ordering
@Injectable({ providedIn: 'root' })
export class CamRequisitionManagementFacade {
  constructor(private store: Store, private router: Router) {}

  requisitionsError$ = this.store.pipe(select(getCamfilRequisitionsError));
  requisitionsLoading$ = this.store.pipe(select(getCamfilRequisitionsLoading));

  requisitionsStatus$ = this.store.pipe(
    select(selectRouteParam('status')),
    map(status => status || 'PENDING')
  );

  selectedRequisition$ = this.store.pipe(
    select(selectRouteParam('requisitionId')),
    whenTruthy(),
    switchMap(requisitionId => this.store.pipe(select(getCamfilRequisition(requisitionId))))
  );

  requisition$(requisitionId: string) {
    this.store.dispatch(loadCamfilRequisition({ requisitionId }));
    return this.store.pipe(select(getCamfilRequisition(requisitionId)));
  }

  requisitions$(view: CamfilRequisitionViewer) {
    this.store.dispatch(loadCamfilRequisitions({ view }));
    return this.store.pipe(select(getCamfilRequisitions));
  }

  requisitionsByRoute$ = combineLatest([
    this.store.pipe(
      select(selectUrl),
      map(url => (url.includes('/buyer') ? 'buyer' : 'approver')),
      distinctUntilChanged()
    ),
    this.store.pipe(select(selectRouteParam('status')), distinctUntilChanged()),
  ]).pipe(
    sample(
      this.router.events.pipe(
        // only when navigation is finished
        filter(e => e instanceof NavigationEnd),
        // fire on first subscription
        startWith({})
      )
    ),
    switchMap(([view]) => this.requisitions$(view as CamfilRequisitionViewer))
  );

  createCamfilRequisition() {
    this.store.dispatch(createCamfilRequisition());
  }

  updateCamfilRequisition(requisition: CamfilRequisition, addressId?: string, address?: Address) {
    this.store.dispatch(updateCamfilRequisition({ requisition, addressId, address }));
  }

  // Line items quantity
  updateCamfilRequisitionLineItem(requisitionId: string, lineItemUpdate: CamfilRequisitionLineItemUpdate) {
    this.store.dispatch(
      updateCamfilRequisitionLineItem({
        requisitionId,
        lineItemUpdate,
      })
    );
  }

  // Line items attributes
  addCamfilRequisitionLineItemAttribute(requisitionId: string, lineItemId: string, lineItemAttribute: Attribute) {
    this.store.dispatch(addCamfilRequisitionLineItemAttribute({ requisitionId, lineItemId, lineItemAttribute }));
  }

  deleteCamfilRequisitionLineItemAttributes(requisitionId: string, lineItemId: string, lineItemAttribute: Attribute) {
    this.store.dispatch(deleteCamfilRequisitionLineItemAttribute({ requisitionId, lineItemId, lineItemAttribute }));
  }

  updateCamfilRequisitionLineItemAttribute(requisitionId: string, lineItemId: string, lineItemAttribute: Attribute) {
    this.store.dispatch(
      updateCamfilRequisitionLineItemAttribute({
        requisitionId,
        lineItemId,
        lineItemAttribute,
      })
    );
  }

  // Change status for multiple requisitions
  approveMultipleRequisitions$(requisitionIds: string[]) {
    this.store.dispatch(
      updateMultipleCamfilRequisitionStatus({
        requisitionIds,
        status: 'APPROVED',
      })
    );
  }

  rejectMultipleRequisitions$(requisitionIds: string[], comment?: string) {
    this.store.dispatch(
      updateMultipleCamfilRequisitionStatus({
        requisitionIds,
        status: 'APPROVED',
        approvalComment: comment,
      })
    );
  }
}
