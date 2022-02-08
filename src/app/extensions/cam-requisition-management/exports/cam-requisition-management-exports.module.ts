import { NgModule } from '@angular/core';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { LAZY_FEATURE_MODULE } from 'ish-core/utils/module-loader/module-loader.service';

import { LazyCamRequisitionCheckoutButtonComponent } from './lazy-cam-requisition-checkout-button/lazy-cam-requisition-checkout-button.component';
import { LazyCamfilCheckoutReceiptRequisitionComponent } from './lazy-camfil-checkout-receipt-requisition/lazy-camfil-checkout-receipt-requisition.component';

@NgModule({
  imports: [FeatureToggleModule],
  providers: [
    {
      provide: LAZY_FEATURE_MODULE,
      useValue: {
        feature: 'camRequisitionManagement',
        location: import('../store/cam-requisition-management-store.module'),
      },
      multi: true,
    },
  ],
  declarations: [LazyCamRequisitionCheckoutButtonComponent, LazyCamfilCheckoutReceiptRequisitionComponent],
  exports: [LazyCamRequisitionCheckoutButtonComponent, LazyCamfilCheckoutReceiptRequisitionComponent],
})
export class CamRequisitionManagementExportsModule {}
