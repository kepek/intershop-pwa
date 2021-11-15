// tslint:disable: ish-ordered-imports ban-specific-imports
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { CamCardsModule } from '../../extensions/cam-cards/cam-cards.module';
import { AddEmailRecipientModalComponent } from './add-email-recipient-modal/add-email-recipient-modal.component';
import { CamfilCheckoutBucketComponent } from './camfil-checkout-bucket/camfil-checkout-bucket.component';
import { CamfilDeleteOrderComponent } from './camfil-checkout-bucket/camfil-delete-order/camfil-delete-order.component';
import { EditOrderModalComponent } from './camfil-checkout-bucket/edit-order-modal/edit-order-modal.component';
import { CamfilCheckoutHeaderComponent } from './camfil-checkout-header/camfil-checkout-header.component';
import { CamfilCheckoutLineItemComponent } from './camfil-checkout-line-item/camfil-checkout-line-item.component';
import { CamfilCheckoutPageComponent } from './camfil-checkout-page.component';
import { CamfilCheckoutPaymentComponent } from './camfil-checkout-payment/camfil-checkout-payment.component';
import { CamfilCheckoutSummaryComponent } from './camfil-checkout-summary/camfil-checkout-summary.component';
import { CamfilCheckoutToolbarComponent } from './camfil-checkout-toolbar/camfil-checkout-toolbar.component';
import { CreateNewCamcardComponent } from './camfil-checkout-toolbar/create-new-camcard/create-new-camcard.component';
import { CreateOrderButtonComponent } from './camfil-checkout-toolbar/create-order-button/create-order-button.component';
import { PrintOrderComponent } from './camfil-checkout-toolbar/print-order/print-order.component';
import { CamfilPaymentConcardisComponent } from './camfil-payment-concardis/camfil-payment-concardis.component';
import { CamfilPaymentConcardisCreditCardComponent } from './camfil-payment-concardis-creditcard/camfil-payment-concardis-creditcard.component';
import { CamfilPaymentConcardisCreditcardCvcDetailComponent } from './camfil-payment-concardis-creditcard-cvc-detail/camfil-payment-concardis-creditcard-cvc-detail.component';
import { CamfilPaymentConcardisDirectdebitComponent } from './camfil-payment-concardis-directdebit/camfil-payment-concardis-directdebit.component';
import { CamfilCheckoutGuestFormComponent } from './camfil-checkout-guest-form/camfil-checkout-guest-form.component';
import { CheckoutPaymentPageModule } from '../checkout-payment/checkout-payment-page.module';
import { CamfilShoppingBucketEmptyComponent } from '../basket/camfil-shopping-bucket-empty/camfil-shopping-bucket-empty.component';

const camfilCheckoutPageRoutes: Routes = [
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
  imports: [CamCardsModule, CheckoutPaymentPageModule, RouterModule.forChild(camfilCheckoutPageRoutes), SharedModule],
  declarations: [
    AddEmailRecipientModalComponent,
    CamfilCheckoutBucketComponent,
    CamfilCheckoutGuestFormComponent,
    CamfilCheckoutHeaderComponent,
    CamfilCheckoutLineItemComponent,
    CamfilCheckoutPageComponent,
    CamfilCheckoutPaymentComponent,
    CamfilCheckoutSummaryComponent,
    CamfilCheckoutToolbarComponent,
    CamfilDeleteOrderComponent,
    CamfilPaymentConcardisComponent,
    CamfilPaymentConcardisCreditCardComponent,
    CamfilPaymentConcardisCreditcardCvcDetailComponent,
    CamfilPaymentConcardisDirectdebitComponent,
    CamfilShoppingBucketEmptyComponent,
    CreateNewCamcardComponent,
    CreateOrderButtonComponent,
    EditOrderModalComponent,
    PrintOrderComponent,
  ],
})
export class CamfilCheckoutPageModule {}
