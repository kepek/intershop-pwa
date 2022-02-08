import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { User } from '@sentry/browser';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { ModalAddNewProductComponent } from 'src/app/extensions/cam-cards/pages/account-cam-card-detail/modal-add-new-product/modal-add-new-product.component';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { AppFacade } from 'ish-core/facades/app.facade';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';

import { CamRequisitionManagementFacade } from '../../facades/cam-requisition-management.facade';
import { RequisitionContextFacade } from '../../facades/requisition-context.facade';
import { Requisition } from '../../models/requisition/requisition.model';

@Component({
  selector: 'camfil-requisition-detail-page',
  templateUrl: './requisition-detail-page.component.html',
  styleUrls: ['./requisition-detail-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RequisitionContextFacade],
})
export class RequisitionDetailPageComponent implements OnInit, OnDestroy {
  requisition$: Observable<Requisition>;
  deviceType$: Observable<DeviceType>;
  requisitionId: string;
  error$: Observable<HttpError>;
  loading$: Observable<boolean>;
  view$: Observable<'buyer' | 'approver'>;
  user$: Observable<User>;
  userPermissions$: Observable<string[]>;
  lineItemsChecked = [];

  private destroy$ = new Subject<void>();

  constructor(
    private context: RequisitionContextFacade,
    public dialog: MatDialog,
    private camRequisitionManagementFacade: CamRequisitionManagementFacade,
    private appFacade: AppFacade,
    private accountFacade: AccountFacade
  ) {}

  ngOnInit() {
    this.requisition$ = this.context.select('entity');
    this.requisition$.pipe(takeUntil(this.destroy$)).subscribe(req => {
      this.requisitionId = req.id;
    });
    this.loading$ = this.context.select('loading');
    this.error$ = this.context.select('error');
    this.view$ = this.context.select('view');
    this.deviceType$ = this.appFacade.deviceType$;
    this.user$ = this.accountFacade.user$;
    this.userPermissions$ = this.accountFacade.userPermissions$;
  }

  approveRequisition() {
    this.context.approveRequisition$();
  }

  rejectRequisition(comment: string) {
    this.context.rejectRequisition$(comment);
    return false;
  }

  openAddToProductModal(modal: ModalAddNewProductComponent) {
    const dialogRef = this.dialog.open(modal.show());
    modal.hide = () => this.dialog.closeAll();

    dialogRef
      .afterClosed()
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe(() => {
        modal.reset();
      });
  }

  toggleAllLineItems(lineItemsIds: string[]) {
    this.lineItemsChecked = lineItemsIds;
  }

  removeSelectedLineItems() {
    this.camRequisitionManagementFacade.removeProductsFromRequisition(this.lineItemsChecked, this.requisitionId);
  }

  removeSelectedLineItem(lineItemId) {
    this.camRequisitionManagementFacade.removeProductsFromRequisition([lineItemId], this.requisitionId);
  }

  approveSelectedLineItems() {
    this.camRequisitionManagementFacade.updateRequisitionLineItemAttribute(this.lineItemsChecked, this.requisitionId, {
      name: 'approved',
      value: true,
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
