import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { distinctUntilChanged, filter, map, sample, startWith, switchMap } from 'rxjs/operators';

import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { selectRouteParam, selectUrl } from 'ish-core/store/core/router';
import { whenTruthy } from 'ish-core/utils/operators';

import { CamfilRequisition } from '../models/camfil-requisition/camfil-requisition.model';
import {
  addProductToCamfilRequisition,
  createCamfilRequisition,
  getCamfilRequisition,
  getCamfilRequisitions,
  getCamfilRequisitionsError,
  getCamfilRequisitionsLoading,
  loadCamfilRequisition,
  loadCamfilRequisitions,
  removeProductsFromCamfilRequisition,
  updateCamfilRequisition,
  updateCamfilRequisitionLineItemAttribute,
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

  requisitions$() {
    this.store.dispatch(loadCamfilRequisitions());
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
    switchMap(() => this.requisitions$())
  );

  // CAMFIL Line Items
  createCamfilRequisition() {
    this.store.dispatch(createCamfilRequisition());
  }

  addProductToCamfilRequisition(sku: string, quantity: number, requisitionId: string) {
    this.store.dispatch(
      addProductToCamfilRequisition({
        sku,
        quantity,
        requisitionId,
      })
    );
  }

  removeProductsFromCamfilRequisition(lineItemIds: string[], requisitionId: string) {
    this.store.dispatch(
      removeProductsFromCamfilRequisition({
        lineItemIds,
        requisitionId,
      })
    );
  }

  updateCamfilRequisitionLineItemAttribute(lineItemIds: string[], requisitionId: string, lineItemAttribute: Attribute) {
    this.store.dispatch(
      updateCamfilRequisitionLineItemAttribute({
        lineItemIds,
        requisitionId,
        lineItemAttribute,
      })
    );
  }

  updateCamfilRequisition(requisition: CamfilRequisition) {
    this.store.dispatch(updateCamfilRequisition({ requisition }));
  }
}
