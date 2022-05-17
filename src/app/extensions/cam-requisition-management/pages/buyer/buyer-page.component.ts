import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';

import { CamfilRequisitionContextFacade } from '../../facades/cam-requisition-context.facade';
import { CamRequisitionManagementFacade } from '../../facades/cam-requisition-management.facade';
import { CamfilRequisition, CamfilRequisitionStatus } from '../../models/camfil-requisition/camfil-requisition.model';

@Component({
  selector: 'camfil-buyer-page',
  templateUrl: './buyer-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CamfilRequisitionContextFacade],
})
export class BuyerPageComponent implements OnInit, OnDestroy {
  requisitions$: Observable<CamfilRequisition[]>;
  error$: Observable<HttpError>;
  loading$: Observable<boolean>;
  status$: Observable<CamfilRequisitionStatus>;

  status: CamfilRequisitionStatus;
  columnsToDisplay: string[];
  deviceType$: Observable<DeviceType>;
  view$: Observable<'buyer' | 'approver'>;
  private destroy$ = new Subject();

  constructor(
    private camRequisitionManagementFacade: CamRequisitionManagementFacade,
    private context: CamfilRequisitionContextFacade
  ) {}

  ngOnInit() {
    this.error$ = this.camRequisitionManagementFacade.requisitionsError$;
    this.view$ = this.context.select('view');
    this.loading$ = this.camRequisitionManagementFacade.requisitionsLoading$;
    this.status$ = this.camRequisitionManagementFacade.requisitionsStatus$ as Observable<CamfilRequisitionStatus>;

    this.columnsToDisplay = [
      'customerNumberAndName',
      'requisitionNo',
      'orderMark',
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
