import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { CamfilCheckoutOnestepPageModule } from '../camfil-checkout-onestep/camfil-checkout-onestep-page.module';
import { CamfilCheckoutReceiptPageModule } from '../camfil-checkout-receipt/camfil-checkout-receipt-page.module';

import { CamfilCheckoutPageComponent } from './camfil-checkout-page.component';

const camfilCheckoutPageRoutes: Routes = [
  {
    path: '',
    component: CamfilCheckoutPageComponent,
    children: [
      {
        path: 'onestep',
        component: CamfilCheckoutOnestepPageModule.component,
      },
      {
        path: 'receipt',
        component: CamfilCheckoutReceiptPageModule.component,
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'onestep',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(camfilCheckoutPageRoutes), SharedModule],
  declarations: [CamfilCheckoutPageComponent],
})
export class CamfilCheckoutPageModule {}
