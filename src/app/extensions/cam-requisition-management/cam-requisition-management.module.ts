import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { CamfilCheckoutReceiptRequisitionComponent } from './components/camfil-checkout-receipt-requisition/camfil-checkout-receipt-requisition.component';
import { CamfilRequisitionDetailToolbarComponent } from './components/camfil-requisition-detail-toolbar/camfil-requisition-detail-toolbar.component';
import { CamfilRequisitionLineItemQuantityComponent } from './components/camfil-requisition-line-item-table/camfil-requisition-line-item-quantity/camfil-requisition-line-item-quantity.component';
import { CamfilRequisitionLineItemTableComponent } from './components/camfil-requisition-line-item-table/camfil-requisition-line-item-table.component';
import { CamfilRequisitionRejectDialogComponent } from './components/camfil-requisition-reject-dialog/camfil-requisition-reject-dialog.component';
import { CamfilRequisitionSummaryComponent } from './components/camfil-requisition-summary/camfil-requisition-summary.component';
import { EditApprovalDetailsModalComponent } from './components/camfil-requisition-summary/edit-approval-details-modal/edit-approval-details-modal.component';
import { CamfilRequisitionsListComponent } from './components/camfil-requisitions-list/camfil-requisitions-list.component';
import { CamRequisitionManagementRoutingModule } from './pages/cam-requisition-management-routing.module';
import { CamRequisitionCheckoutButtonComponent } from './shared/cam-requisition-checkout-button/cam-requisition-checkout-button.component';
import { CamRequisitionManagementStoreModule } from './store/cam-requisition-management-store.module';

const exportedComponents = [
  CamfilCheckoutReceiptRequisitionComponent,
  CamfilRequisitionDetailToolbarComponent,
  CamfilRequisitionLineItemQuantityComponent,
  CamfilRequisitionLineItemTableComponent,
  CamfilRequisitionRejectDialogComponent,
  CamfilRequisitionSummaryComponent,
  CamfilRequisitionsListComponent,
  EditApprovalDetailsModalComponent,
];

@NgModule({
  imports: [CamRequisitionManagementRoutingModule, CamRequisitionManagementStoreModule, SharedModule],
  declarations: [...exportedComponents, CamRequisitionCheckoutButtonComponent],
  exports: [...exportedComponents],
})
export class CamRequisitionManagementModule {}
