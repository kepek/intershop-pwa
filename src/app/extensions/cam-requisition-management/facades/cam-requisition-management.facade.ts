import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { distinctUntilChanged, filter, map, sample, startWith, switchMap } from 'rxjs/operators';

import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { selectRouteParam, selectUrl } from 'ish-core/store/core/router';
import { whenTruthy } from 'ish-core/utils/operators';

import { Requisition } from '../models/requisition/requisition.model';
import {
  addProductToRequisition,
  createRequisition,
  getRequisition,
  getRequisitions,
  getRequisitionsError,
  getRequisitionsLoading,
  loadRequisition,
  loadRequisitions,
  removeProductsFromRequisition,
  updateRequisition,
  updateRequisitionLineItemAttribute,
} from '../store/requisitions';

// tslint:disable:member-ordering
@Injectable({ providedIn: 'root' })
export class CamRequisitionManagementFacade {
  constructor(private store: Store, private router: Router) {}

  requisitionsError$ = this.store.pipe(select(getRequisitionsError));
  requisitionsLoading$ = this.store.pipe(select(getRequisitionsLoading));

  requisitionsStatus$ = this.store.pipe(
    select(selectRouteParam('status')),
    map(status => status || 'PENDING')
  );

  selectedRequisition$ = this.store.pipe(
    select(selectRouteParam('requisitionId')),
    whenTruthy(),
    switchMap(requisitionId => this.store.pipe(select(getRequisition(requisitionId))))
  );

  requisition$(requisitionId: string) {
    this.store.dispatch(loadRequisition({ requisitionId }));
    return this.store.pipe(select(getRequisition(requisitionId)));
  }

  requisitions$() {
    this.store.dispatch(loadRequisitions());
    return this.store.pipe(select(getRequisitions));
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
  createRequisition() {
    this.store.dispatch(createRequisition());
  }

  addProductToRequisition(sku: string, quantity: number, requisitionId: string) {
    this.store.dispatch(
      addProductToRequisition({
        sku,
        quantity,
        requisitionId,
      })
    );
  }

  removeProductsFromRequisition(lineItemIds: string[], requisitionId: string) {
    this.store.dispatch(
      removeProductsFromRequisition({
        lineItemIds,
        requisitionId,
      })
    );
  }

  updateRequisitionLineItemAttribute(lineItemIds: string[], requisitionId: string, lineItemAttribute: Attribute) {
    this.store.dispatch(
      updateRequisitionLineItemAttribute({
        lineItemIds,
        requisitionId,
        lineItemAttribute,
      })
    );
  }

  updateRequisition(requisition: Requisition) {
    this.store.dispatch(updateRequisition({ requisition }));
  }
}
