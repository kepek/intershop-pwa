import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { CamCardsModule } from '../../extensions/cam-cards/cam-cards.module';
import { CamfilCheckoutLineItemComponent } from '../camfil-checkout/camfil-checkout-line-item/camfil-checkout-line-item.component';
import { CamfilCheckoutListComponent } from '../camfil-checkout/camfil-checkout-list/camfil-checkout-list.component';
import { CamfilCheckoutSummaryComponent } from '../camfil-checkout/camfil-checkout-summary/camfil-checkout-summary.component';
import { CamfillCheckoutHeaderComponent } from '../camfil-checkout/camfill-checkout-header/camfill-checkout-header.component';
import { CamfillCheckoutToolbarComponent } from '../camfil-checkout/camfill-checkout-toolbar/camfill-checkout-toolbar.component';
import { CreateNewCamcardComponent } from '../camfil-checkout/camfill-checkout-toolbar/create-new-camcard/create-new-camcard.component';
import { CreateOrderButtonComponent } from '../camfil-checkout/camfill-checkout-toolbar/create-order-button/create-order-button.component';
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
  imports: [CamCardsModule, RouterModule.forChild(checkoutPageRoutes), SharedModule],
  declarations: [
    CamfilCheckoutLineItemComponent,
    CamfilCheckoutListComponent,
    CamfilCheckoutSummaryComponent,
    CamfillCheckoutHeaderComponent,
    CamfillCheckoutToolbarComponent,
    CheckoutPageComponent,
    CreateNewCamcardComponent,
    CreateOrderButtonComponent,
  ],
})
export class CheckoutPageModule {}
