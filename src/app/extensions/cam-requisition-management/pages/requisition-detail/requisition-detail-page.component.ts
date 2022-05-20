import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { User } from '@sentry/browser';
import { QuickAddProduct } from 'camfil-pwa/models/camfil-quick-add-product/camfil-quick-add-product.model';
import { Observable, Subject, combineLatest } from 'rxjs';
import { distinctUntilChanged, map, take, takeUntil } from 'rxjs/operators';
import { ModalAddNewProductComponent } from 'src/app/extensions/cam-cards/pages/account-cam-card-detail/modal-add-new-product/modal-add-new-product.component';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { AppFacade } from 'ish-core/facades/app.facade';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { LineItem } from 'ish-core/models/line-item/line-item.model';
import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';
import { CamfilModalDialogComponent } from 'ish-shared/components/common/camfil-modal-dialog/camfil-modal-dialog.component';

import { CamfilApproveLineItemSuccesDialogComponent } from '../../components/camfil-approve-line-item-succes-dialog/camfil-approve-line-item-succes-dialog.component';
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
  partiallyApproved$: Observable<boolean>;
  lineItemsChecked = [];
  requisitionStatus = CamRequisitionStatusValues;
  isEditable$: Observable<boolean>;
  unavailableProducts$: Observable<{ sku: string; availability: boolean }[]>;
  lineItems$: Observable<LineItem[]>;
  getIsCamfilRequisitionEditable = CamfilRequisitionHelper.getIsCamfilRequisitionEditable;
  @ViewChild('unavailableProductsModal') unavailableProductsModal: CamfilModalDialogComponent<any>;
  @ViewChild('approveLineItemsSuccessDialog')
  approveLineItemsSuccessDialog: CamfilApproveLineItemSuccesDialogComponent;

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
    this.partiallyApproved$ = this.context.select('partiallyApproved');
    this.partiallyApproved$?.pipe(distinctUntilChanged(), takeUntil(this.destroy$)).subscribe(success => {
      if (success) {
        this.openApprovedLineItemsSuccessDialog();
      }
    });
    this.isEditable$ = this.requisition$.pipe(map(({ approval }) => this.getIsCamfilRequisitionEditable(approval)));
    this.unavailableProducts$ = this.context.select('unavailableProducts');
    this.unavailableProducts$?.pipe(distinctUntilChanged(), takeUntil(this.destroy$)).subscribe(unavailableProducts => {
      if (unavailableProducts?.length) {
        this.unavailableProductsModal?.show();
      }
    });
    this.lineItems$ = this.context.select('lineItems');
  }

  approveRequisition() {
    this.unavailableProducts$.pipe(take(1)).subscribe(unavailableProducts => {
      if (unavailableProducts?.length) {
        this.unavailableProductsModal?.show();
      } else {
        this.context.approveRequisition$();
      }
    });
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
      combineLatest([this.unavailableProducts$, this.lineItems$])
        .pipe(take(1), takeUntil(this.destroy$))
        .subscribe(([unavailableProducts, lineItems]) => {
          if (unavailableProducts) {
            const unavailableProductsSkus = unavailableProducts.map(product => product.sku);
            const unavailableLineItems = lineItems.filter(li =>
              this.isSelectedLineItemUnavailable(unavailableProductsSkus, li.productSKU)
            );
            if (unavailableLineItems.length) {
              this.unavailableProductsModal?.show();
            } else {
              this.context.approveCamfilRequisitionLineItem(this.lineItemsChecked);
            }
          } else {
            this.context.approveCamfilRequisitionLineItem(this.lineItemsChecked);
          }
        });
    }
  }

  openApprovedLineItemsSuccessDialog() {
    this.approveLineItemsSuccessDialog?.show();
  }

  isSelectedLineItemUnavailable(unavailableProductsSkus: string[], lineItemProductSku: string): boolean {
    return unavailableProductsSkus.includes(lineItemProductSku);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  sumbitAddProductToRequisition(quickAddData: QuickAddProduct, requisition: CamfilRequisition) {
    const { sku, quantity, boxLabel, measurements } = quickAddData;
    const { approval } = requisition;
    if (this.getIsCamfilRequisitionEditable(approval)) {
      this.context.addProductToCamfilRequisition({ sku, quantity, boxLabel, measurements });
    }
  }
}
