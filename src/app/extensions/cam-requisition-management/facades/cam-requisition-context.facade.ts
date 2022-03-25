import { Injectable, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { RxState } from '@rx-angular/state';
import { distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';

import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { selectRouteParam, selectUrl } from 'ish-core/store/core/router';
import { whenTruthy } from 'ish-core/utils/operators';

import { CamfilRequisition } from '../models/camfil-requisition/camfil-requisition.model';
import {
  addProductToCamfilRequisition,
  approveCamfilRequisitionLineItems,
  getCamfilRequisition,
  getCamfilRequisitionsError,
  getCamfilRequisitionsLoading,
  loadCamfilRequisition,
  removeMultipleProductsFromCamfilRequisition,
  removeProductFromCamfilRequisition,
  updateCamfilRequisitionStatus,
} from '../store/camfil-requisitions';

@Injectable()
export class CamfilRequisitionContextFacade
  extends RxState<{
    id: string;
    loading: boolean;
    error: HttpError;
    entity: CamfilRequisition;
    view: 'buyer' | 'approver';
  }>
  implements OnDestroy {
  constructor(private store: Store) {
    super();

    this.connect('id', this.store.pipe(select(selectRouteParam('requisitionId'))));

    this.connect('loading', this.store.pipe(select(getCamfilRequisitionsLoading)));

    this.connect('error', this.store.pipe(select(getCamfilRequisitionsError)));

    this.connect(
      'entity',
      this.select('id').pipe(
        whenTruthy(),
        distinctUntilChanged(),
        tap(requisitionId => this.store.dispatch(loadCamfilRequisition({ requisitionId }))),
        switchMap(requisitionId =>
          this.store.pipe(
            select(getCamfilRequisition(requisitionId)),
            whenTruthy(),
            map(entity => entity as CamfilRequisition)
          )
        ),
        whenTruthy()
      )
    );

    this.connect(
      'view',
      this.store.pipe(
        select(selectUrl),
        map(url => (url.includes('/buyer') ? 'buyer' : 'approver'))
      )
    );
  }

  approveRequisition$() {
    this.store.dispatch(
      updateCamfilRequisitionStatus({
        requisitionId: this.get('entity', 'id'),
        status: 'APPROVED',
      })
    );
  }

  rejectRequisition$(comment?: string) {
    this.store.dispatch(
      updateCamfilRequisitionStatus({
        requisitionId: this.get('entity', 'id'),
        status: 'REJECTED',
        approvalComment: comment,
      })
    );
  }

  addProductToCamfilRequisition(item: { sku: string; quantity: number }) {
    this.store.dispatch(
      addProductToCamfilRequisition({
        requisitionId: this.get('entity', 'id'),
        item,
      })
    );
  }

  removeSelectedLineItem(lineItemId: string) {
    this.store.dispatch(
      removeProductFromCamfilRequisition({
        lineItemId,
        requisitionId: this.get('entity', 'id'),
      })
    );
  }

  removeMultipleProductsFromCamfilRequisition(lineItemsIds: string[]) {
    this.store.dispatch(
      removeMultipleProductsFromCamfilRequisition({
        lineItemsIds,
        requisitionId: this.get('entity', 'id'),
      })
    );
  }

  approveCamfilRequisitionLineItem(lineItemIds: string[], lineItemAttribute: Attribute) {
    this.store.dispatch(
      approveCamfilRequisitionLineItems({
        requisitionId: this.get('entity', 'id'),
        lineItemIds,
        lineItemAttribute,
      })
    );
  }
}
