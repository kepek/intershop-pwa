import { NgModule } from '@angular/core';
import { RequisitionManagementExportsModule } from 'requisition-management';

import { SharedModule } from 'ish-shared/shared.module';

import { CamfilCheckoutReceiptCreateCamCardDialogComponent } from './camfil-checkout-receipt-create-camcard-dialog/camfil-checkout-receipt-create-camcard-dialog.component';
import { CamfilCheckoutReceiptOrderComponent } from './camfil-checkout-receipt-order/camfil-checkout-receipt-order.component';
import { CamfilCheckoutReceiptPageComponent } from './camfil-checkout-receipt-page.component';
import { CamfilCheckoutReceiptComponent } from './camfil-checkout-receipt/camfil-checkout-receipt.component';

@NgModule({
  imports: [RequisitionManagementExportsModule, SharedModule],
  declarations: [
    CamfilCheckoutReceiptComponent,
    CamfilCheckoutReceiptCreateCamCardDialogComponent,
    CamfilCheckoutReceiptOrderComponent,
    CamfilCheckoutReceiptPageComponent,
  ],
})
export class CamfilCheckoutReceiptPageModule {
  static component = CamfilCheckoutReceiptPageComponent;
}
