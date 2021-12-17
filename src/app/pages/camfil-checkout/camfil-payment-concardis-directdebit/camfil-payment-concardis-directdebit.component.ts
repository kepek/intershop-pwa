import { ChangeDetectionStrategy, Component } from '@angular/core';

import { PaymentConcardisDirectdebitComponent } from '../../checkout-payment/payment-concardis-directdebit/payment-concardis-directdebit.component';

/**
 * The Payment Concardis Directdebit Component renders a form on which the user can enter his concardis direct debit data. Some entry fields are provided by an external host and embedded as iframes. Therefore an external javascript is loaded. See also {@link CheckoutPaymentPageComponent}
 *
 * @example
 * <camfil-payment-concardis-directdebit
 [paymentMethod]="paymentMethod"
 [activated]="i === openFormIndex"
 (submit)="createNewPaymentInstrument($event)"
 (cancel)="cancelNewPaymentInstrument()"
 ></camfil-payment-concardis-directdebit>
 */
@Component({
  selector: 'camfil-payment-concardis-directdebit',
  templateUrl: './camfil-payment-concardis-directdebit.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
// tslint:disable-next-line: rxjs-prefer-angular-takeuntil
export class CamfilPaymentConcardisDirectdebitComponent extends PaymentConcardisDirectdebitComponent {}
