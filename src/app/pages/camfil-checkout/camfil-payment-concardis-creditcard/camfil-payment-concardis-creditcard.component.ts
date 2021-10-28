// tslint:disable: no-console ish-ordered-imports force-jsdoc-comments project-structure ban-specific-imports

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FloatLabelType } from '@angular/material/form-field';

import { PaymentConcardisCreditcardComponent } from '../../checkout-payment/payment-concardis-creditcard/payment-concardis-creditcard.component';
import { FormControl, FormGroup } from '@angular/forms';

/**
 * The Payment Concardis Creditcard Component renders a form on which the user can enter his concardis credit card data. Some entry fields are provided by an external host and embedded as iframes. Therefore an external javascript is loaded. See also {@link CheckoutPaymentPageComponent}
 *
 * @example
 * <camfil-payment-concardis-creditcard
 [paymentMethod]="paymentMethod"
 [activated]="i === openFormIndex"
 (submit)="createNewPaymentInstrument($event)"
 (cancel)="cancelNewPaymentInstrument()"
 ></camfil-payment-concardis-creditcard>
 */
@Component({
  selector: 'camfil-payment-concardis-creditcard',
  templateUrl: './camfil-payment-concardis-creditcard.component.html',
  styleUrls: ['./camfil-payment-concardis-creditcard.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
// tslint:disable-next-line: rxjs-prefer-angular-takeuntil
export class CamfilPaymentConcardisCreditCardComponent extends PaymentConcardisCreditcardComponent {
  @Input() floatLabel: FloatLabelType = 'always';

  hiddenParameterForm = new FormGroup({
    hiddenCardNumber: new FormControl(''),
    hiddenCVC: new FormControl(''),
  });
}
