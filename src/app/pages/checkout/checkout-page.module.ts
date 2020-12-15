import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { CamfilCheckoutLineItemComponent } from '../camfil-checkout/camfil-checkout-line-item/camfil-checkout-line-item.component';
import { CamfilCheckoutListComponent } from '../camfil-checkout/camfil-checkout-list/camfil-checkout-list.component';
import { CamfilCheckoutSummaryComponent } from '../camfil-checkout/camfil-checkout-summary/camfil-checkout-summary.component';
import { CamfillCheckoutHeaderComponent } from '../camfil-checkout/camfill-checkout-header/camfill-checkout-header.component';
import { CamfillCheckoutToolbarComponent } from '../camfil-checkout/camfill-checkout-toolbar/camfill-checkout-toolbar.component';
import { CheckoutPageComponent } from '../camfil-checkout/checkout-page.component';

const checkoutPageRoutes: Routes = [
  {
    path: '',
    component: CheckoutPageComponent,
    children: [
      {
        path: '**',
        component: CheckoutPageComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(checkoutPageRoutes), SharedModule],
  declarations: [
    CamfilCheckoutLineItemComponent,
    CamfilCheckoutListComponent,
    CamfilCheckoutSummaryComponent,
    CamfillCheckoutHeaderComponent,
    CamfillCheckoutToolbarComponent,
    CheckoutPageComponent,
  ],
})
export class CheckoutPageModule {}
