import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { User } from '@sentry/browser';
import { QuickAddProduct } from 'camfil-pwa/models/camfil-quick-add-product/camfil-quick-add-product.model';
import { Observable, Subject } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';
import { ModalAddNewProductComponent } from 'src/app/extensions/cam-cards/pages/account-cam-card-detail/modal-add-new-product/modal-add-new-product.component';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { AppFacade } from 'ish-core/facades/app.facade';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';

import { CamfilRequisitionContextFacade } from '../../facades/cam-requisition-context.facade';
import { CamRequisitionStatusValues } from '../../models/camfil-requisition/camfil-requisition-status-values';
import { CamfilRequisitionHelper } from '../../models/camfil-requisition/camfil-requisition.helper';
import { CamfilRequisition } from '../../models/camfil-requisition/camfil-requisition.model';

@Component({
  selector: 'camfil-requisition-detail-page',
  templateUrl: './requisition-detail-page.component.html',
  styleUrls: ['./requisition-detail-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CamfilRequisitionContextFacade],
})
export class RequisitionDetailPageComponent implements OnInit, OnDestroy {
  requisition$: Observable<CamfilRequisition>;
  deviceType$: Observable<DeviceType>;
  error$: Observable<HttpError>;
  loading$: Observable<boolean>;
  view$: Observable<'buyer' | 'approver'>;
  user$: Observable<User>;
  userPermissions$: Observable<string[]>;
  lineItemsChecked = [];
  requisitionStatus = CamRequisitionStatusValues;
  isEditable$: Observable<boolean>;
  getIsCamfilRequisitionEditable = CamfilRequisitionHelper.getIsCamfilRequisitionEditable;

  private destroy$ = new Subject<void>();

  constructor(
    private context: CamfilRequisitionContextFacade,
    public dialog: MatDialog,
    private appFacade: AppFacade,
    private accountFacade: AccountFacade
  ) {}

  ngOnInit() {
    this.requisition$ = this.context.select('entity');
    this.loading$ = this.context.select('loading');
    this.error$ = this.context.select('error');
    this.view$ = this.context.select('view');
    this.deviceType$ = this.appFacade.deviceType$;
    this.user$ = this.accountFacade.user$;
    this.userPermissions$ = this.accountFacade.userPermissions$;
    this.isEditable$ = this.requisition$.pipe(map(({ approval }) => this.getIsCamfilRequisitionEditable(approval)));
  }

  approveRequisition() {
    this.context.approveRequisition$();
  }

  rejectRequisition(comment: string) {
    this.context.rejectRequisition$(comment);
    return false;
  }

  openAddToProductModal(modal: ModalAddNewProductComponent, requisition: CamfilRequisition) {
    const { approval } = requisition;

    if (this.getIsCamfilRequisitionEditable(approval)) {
      const dialogRef = this.dialog.open(modal.show());
      modal.hide = () => this.dialog.closeAll();

      dialogRef
        .afterClosed()
        .pipe(take(1), takeUntil(this.destroy$))
        .subscribe(() => {
          modal.reset();
        });
    }
  }

  toggleAllLineItems(lineItemsIds: string[]) {
    this.lineItemsChecked = lineItemsIds;
  }

  removeMultipleSelectedLineItems(requisition: CamfilRequisition) {
    const { approval } = requisition;
    if (this.getIsCamfilRequisitionEditable(approval)) {
      this.context.removeMultipleProductsFromCamfilRequisition(this.lineItemsChecked);
    }
  }

  removeSelectedLineItem(lineItemId, requisition: CamfilRequisition) {
    const { approval } = requisition;
    if (this.getIsCamfilRequisitionEditable(approval)) {
      this.context.removeSelectedLineItem(lineItemId);
    }
  }

  approveSelectedLineItems(requisition: CamfilRequisition) {
    const { approval } = requisition;
    if (this.getIsCamfilRequisitionEditable(approval)) {
      this.context.approveCamfilRequisitionLineItem(this.lineItemsChecked, {
        name: 'approved',
        value: true,
      });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  sumbitAddProductToRequisition(quickAddData: QuickAddProduct, requisition: CamfilRequisition) {
    const { sku, quantity } = quickAddData;
    const { approval } = requisition;
    if (this.getIsCamfilRequisitionEditable(approval)) {
      this.context.addProductToCamfilRequisition({ sku, quantity });
    }
  }
}
