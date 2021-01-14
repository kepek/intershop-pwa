import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { CamCardsModule } from '../../extensions/cam-cards/cam-cards.module';
import { CamfilCheckoutHeaderComponent } from '../camfil-checkout/camfil-checkout-header/camfil-checkout-header.component';
import { CamfilCheckoutLineItemComponent } from '../camfil-checkout/camfil-checkout-line-item/camfil-checkout-line-item.component';
import { CamfilCheckoutListComponent } from '../camfil-checkout/camfil-checkout-list/camfil-checkout-list.component';
import { CamfilDeleteOrderComponent } from '../camfil-checkout/camfil-checkout-list/camfil-delete-order/camfil-delete-order.component';
import { EditOrderModalComponent } from '../camfil-checkout/camfil-checkout-list/edit-order-modal/edit-order-modal.component';
import { CamfilCheckoutSummaryComponent } from '../camfil-checkout/camfil-checkout-summary/camfil-checkout-summary.component';
import { CamfilCheckoutToolbarComponent } from '../camfil-checkout/camfil-checkout-toolbar/camfil-checkout-toolbar.component';
import { CreateNewCamcardComponent } from '../camfil-checkout/camfil-checkout-toolbar/create-new-camcard/create-new-camcard.component';
import { CreateOrderButtonComponent } from '../camfil-checkout/camfil-checkout-toolbar/create-order-button/create-order-button.component';
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
    CamfilCheckoutHeaderComponent,
    CamfilCheckoutLineItemComponent,
    CamfilCheckoutListComponent,
    CamfilCheckoutSummaryComponent,
    CamfilCheckoutToolbarComponent,
    CamfilDeleteOrderComponent,
    CheckoutPageComponent,
    CreateNewCamcardComponent,
    CreateOrderButtonComponent,
    EditOrderModalComponent,
  ],
})
export class CheckoutPageModule {}
