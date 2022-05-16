import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { AppFacade } from 'ish-core/facades/app.facade';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';

import { CamfilRequisitionContextFacade } from '../../facades/cam-requisition-context.facade';
import { CamRequisitionManagementFacade } from '../../facades/cam-requisition-management.facade';

@Component({
  selector: 'camfil-approver-page',
  templateUrl: './approver-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CamfilRequisitionContextFacade],
})
export class ApproverPageComponent implements OnInit, OnDestroy {
  error$: Observable<HttpError>;
  loading$: Observable<boolean>;
  deviceType$: Observable<DeviceType>;
  view$: Observable<'buyer' | 'approver'>;
  constructor(
    private camRequisitionManagementFacade: CamRequisitionManagementFacade,
    private context: CamfilRequisitionContextFacade,
    private appFacade: AppFacade
  ) {}

  columnsToDisplay: string[];
  private destroy$ = new Subject();

  ngOnInit() {
    this.error$ = this.camRequisitionManagementFacade.requisitionsError$;
    this.view$ = this.context.select('view');
    this.loading$ = this.camRequisitionManagementFacade.requisitionsLoading$;
    this.deviceType$ = this.appFacade.deviceType$;
    this.columnsToDisplay = [
      'checkbox',
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
