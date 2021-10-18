import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { CamCardsModule } from '../../extensions/cam-cards/cam-cards.module';
import { AddEmailRecipientModalComponent } from '../camfil-checkout/add-email-recipient-modal/add-email-recipient-modal.component';
import { CamfilCheckoutHeaderComponent } from '../camfil-checkout/camfil-checkout-header/camfil-checkout-header.component';
import { CamfilCheckoutLineItemComponent } from '../camfil-checkout/camfil-checkout-line-item/camfil-checkout-line-item.component';
import { CamfilCheckoutListComponent } from '../camfil-checkout/camfil-checkout-list/camfil-checkout-list.component';
import { CamfilDeleteOrderComponent } from '../camfil-checkout/camfil-checkout-list/camfil-delete-order/camfil-delete-order.component';
import { CamfilGuestFormComponent } from '../camfil-checkout/camfil-checkout-list/camfil-guest-form/camfil-guest-form.component';
import { EditOrderModalComponent } from '../camfil-checkout/camfil-checkout-list/edit-order-modal/edit-order-modal.component';
import { CamfilCheckoutPageComponent } from '../camfil-checkout/camfil-checkout-page.component';
import { CamfilCheckoutSummaryComponent } from '../camfil-checkout/camfil-checkout-summary/camfil-checkout-summary.component';
import { CamfilCheckoutToolbarComponent } from '../camfil-checkout/camfil-checkout-toolbar/camfil-checkout-toolbar.component';
import { CreateNewCamcardComponent } from '../camfil-checkout/camfil-checkout-toolbar/create-new-camcard/create-new-camcard.component';
import { CreateOrderButtonComponent } from '../camfil-checkout/camfil-checkout-toolbar/create-order-button/create-order-button.component';
import { PrintOrderComponent } from '../camfil-checkout/camfil-checkout-toolbar/print-order/print-order.component';
import { CamfilCheckoutValidationComponent } from '../camfil-checkout/camfil-checkout-validation/camfil-checkout-validation.component';

const checkoutPageRoutes: Routes = [
  {
    path: '',
    component: CamfilCheckoutPageComponent,
    children: [
      {
        path: '**',
        component: CamfilCheckoutPageComponent,
      },
    ],
  },
];

@NgModule({
  imports: [CamCardsModule, RouterModule.forChild(checkoutPageRoutes), SharedModule],
  declarations: [
    AddEmailRecipientModalComponent,
    CamfilCheckoutHeaderComponent,
    CamfilCheckoutLineItemComponent,
    CamfilCheckoutListComponent,
    CamfilCheckoutPageComponent,
    CamfilCheckoutSummaryComponent,
    CamfilCheckoutToolbarComponent,
    CamfilCheckoutValidationComponent,
    CamfilDeleteOrderComponent,
    CamfilGuestFormComponent,
    CreateNewCamcardComponent,
    CreateOrderButtonComponent,
    EditOrderModalComponent,
    PrintOrderComponent,
  ],
})
export class CheckoutPageModule {}
