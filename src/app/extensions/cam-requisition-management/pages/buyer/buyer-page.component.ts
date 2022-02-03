import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';

import { CamRequisitionManagementFacade } from '../../facades/cam-requisition-management.facade';
import { RequisitionContextFacade } from '../../facades/requisition-context.facade';
import { Requisition, RequisitionStatus } from '../../models/requisition/requisition.model';

@Component({
  selector: 'camfil-buyer-page',
  templateUrl: './buyer-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RequisitionContextFacade],
})
export class BuyerPageComponent implements OnInit, OnDestroy {
  requisitions$: Observable<Requisition[]>;
  error$: Observable<HttpError>;
  loading$: Observable<boolean>;
  status$: Observable<RequisitionStatus>;

  status: RequisitionStatus;
  columnsToDisplay: string[];
  deviceType$: Observable<DeviceType>;
  view$: Observable<'buyer' | 'approver'>;
  private destroy$ = new Subject();

  constructor(
    private camRequisitionManagementFacade: CamRequisitionManagementFacade,
    private context: RequisitionContextFacade
  ) {}

  ngOnInit() {
    this.error$ = this.camRequisitionManagementFacade.requisitionsError$;
    this.view$ = this.context.select('view');
    this.loading$ = this.camRequisitionManagementFacade.requisitionsLoading$;
    this.status$ = this.camRequisitionManagementFacade.requisitionsStatus$ as Observable<RequisitionStatus>;

    this.columnsToDisplay = [
      'customerNumberAndName',
      'orderNo',
      'orderGoodsMark',
      'creationDate',
      'buyer',
      'status',
      'orderChannel',
    ];
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
