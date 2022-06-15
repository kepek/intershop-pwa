import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { CamfilApproveLineItemSuccesDialogComponent } from './components/camfil-approve-line-item-succes-dialog/camfil-approve-line-item-succes-dialog.component';
import { CamfilRequisitionDetailToolbarComponent } from './components/camfil-requisition-detail-toolbar/camfil-requisition-detail-toolbar.component';
import { CamfilRequisitionLineItemBoxLabelComponent } from './components/camfil-requisition-line-item-table/camfil-requisition-line-item-box-label/camfil-requisition-line-item-box-label.component';
import { CamfilRequisitionLineItemQuantityComponent } from './components/camfil-requisition-line-item-table/camfil-requisition-line-item-quantity/camfil-requisition-line-item-quantity.component';
import { CamfilRequisitionLineItemTableComponent } from './components/camfil-requisition-line-item-table/camfil-requisition-line-item-table.component';
import { CamfilRequisitionRejectDialogComponent } from './components/camfil-requisition-reject-dialog/camfil-requisition-reject-dialog.component';
import { CamfilRequisitionSummaryComponent } from './components/camfil-requisition-summary/camfil-requisition-summary.component';
import { EditApprovalDetailsModalComponent } from './components/camfil-requisition-summary/edit-approval-details-modal/edit-approval-details-modal.component';
import { CamfilRequisitionsListComponent } from './components/camfil-requisitions-list/camfil-requisitions-list.component';
import { CamRequisitionCheckoutButtonComponent } from './shared/cam-requisition-checkout-button/cam-requisition-checkout-button.component';
import { CamfilCheckoutReceiptRequisitionComponent } from './shared/camfil-checkout-receipt-requisition/camfil-checkout-receipt-requisition.component';
import { CamRequisitionManagementStoreModule } from './store/cam-requisition-management-store.module';

const exportedComponents = [
  CamRequisitionCheckoutButtonComponent,
  CamfilApproveLineItemSuccesDialogComponent,
  CamfilCheckoutReceiptRequisitionComponent,
  CamfilRequisitionDetailToolbarComponent,
  CamfilRequisitionLineItemBoxLabelComponent,
  CamfilRequisitionLineItemQuantityComponent,
  CamfilRequisitionLineItemTableComponent,
  CamfilRequisitionRejectDialogComponent,
  CamfilRequisitionSummaryComponent,
  CamfilRequisitionsListComponent,
  EditApprovalDetailsModalComponent,
];

@NgModule({
  imports: [CamRequisitionManagementStoreModule, SharedModule],
  declarations: [...exportedComponents],
  exports: [...exportedComponents],
})
export class CamRequisitionManagementModule {}
