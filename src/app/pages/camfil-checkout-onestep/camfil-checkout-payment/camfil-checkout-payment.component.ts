import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CheckoutPaymentComponent } from '../../checkout-payment/checkout-payment/checkout-payment.component';

/**
 * The Checkout Payment Component renders the checkout payment page. On this page the user can select a payment method. Some payment methods require the user to enter some additional data, like credit card data. For some payment methods there is special javascript functionality necessary provided by an external payment host. See also {@link CheckoutPaymentPageComponent}
 *
 */
@Component({
  selector: 'camfil-checkout-payment',
  templateUrl: './camfil-checkout-payment.component.html',
  styleUrls: ['./camfil-checkout-payment.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class CamfilCheckoutPaymentComponent extends CheckoutPaymentComponent {}
