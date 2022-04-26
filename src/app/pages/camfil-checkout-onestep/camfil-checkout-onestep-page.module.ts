// tslint:disable: ish-ordered-imports ban-specific-imports
import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { CamCardsModule } from '../../extensions/cam-cards/cam-cards.module';
import { CamfilCheckoutHeaderComponent } from './camfil-checkout-header/camfil-checkout-header.component';
import { CamfilCheckoutPaymentComponent } from './camfil-checkout-payment/camfil-checkout-payment.component';
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

import { CamfilCheckoutOnestepPageComponent } from './camfil-checkout-onestep-page.component';
import { CamfilCheckoutAddEmailRecipientModalComponent } from './camfil-checkout-add-email-recipient-modal/camfil-checkout-add-email-recipient-modal.component';
import { CamfilCheckoutGoodsAcceptanceModalComponent } from './camfil-checkout-goods-acceptance-modal/camfil-checkout-goods-acceptance-modal.component';

const exportedComponents = [
  CamfilCheckoutAddEmailRecipientModalComponent,
  CamfilCheckoutGuestFormComponent,
  CamfilCheckoutHeaderComponent,
  CamfilCheckoutPaymentComponent,
  CamfilCheckoutToolbarComponent,
  CamfilPaymentConcardisComponent,
  CamfilPaymentConcardisCreditCardComponent,
  CamfilPaymentConcardisCreditcardCvcDetailComponent,
  CamfilPaymentConcardisDirectdebitComponent,
  CreateNewCamcardComponent,
  CreateOrderButtonComponent,
  PrintOrderComponent,
];

@NgModule({
  imports: [CamCardsModule, CheckoutPaymentPageModule, SharedModule],
  declarations: [
    ...exportedComponents,
    CamfilCheckoutGoodsAcceptanceModalComponent,
    CamfilCheckoutOnestepPageComponent,
  ],
  exports: [...exportedComponents],
})
export class CamfilCheckoutOnestepPageModule {
  static component = CamfilCheckoutOnestepPageComponent;
}
