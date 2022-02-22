import { Injectable, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { RxState } from '@rx-angular/state';
import { distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { selectRouteParam, selectUrl } from 'ish-core/store/core/router';
import { whenTruthy } from 'ish-core/utils/operators';

import { CamfilRequisition } from '../models/camfil-requisition/camfil-requisition.model';
import {
  getCamfilRequisition,
  getCamfilRequisitionsError,
  getCamfilRequisitionsLoading,
  loadCamfilRequisition,
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
}
