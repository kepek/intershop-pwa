import { ChangeDetectionStrategy, Component } from '@angular/core';

import { PaymentConcardisCreditcardCvcDetailComponent } from '../../checkout-payment/payment-concardis-creditcard-cvc-detail/payment-concardis-creditcard-cvc-detail.component';

@Component({
  selector: 'camfil-payment-concardis-creditcard-cvc-detail',
  templateUrl: './camfil-payment-concardis-creditcard-cvc-detail.component.html',
  styleUrls: ['./camfil-payment-concardis-creditcard-cvc-detail.component.scss'],

  changeDetection: ChangeDetectionStrategy.OnPush,
})
// tslint:disable-next-line: rxjs-prefer-angular-takeuntil
export class CamfilPaymentConcardisCreditcardCvcDetailComponent extends PaymentConcardisCreditcardCvcDetailComponent {}
