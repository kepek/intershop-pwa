import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

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
  declarations: [CheckoutPageComponent],
})
export class CheckoutPageModule {}
