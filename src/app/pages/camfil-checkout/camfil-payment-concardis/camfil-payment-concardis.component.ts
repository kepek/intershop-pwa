import { ChangeDetectionStrategy, Component } from '@angular/core';

import { PaymentConcardisComponent } from '../../checkout-payment/payment-concardis/payment-concardis.component';

@Component({
  selector: 'camfil-payment-concardis',
  template: ' ',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class CamfilPaymentConcardisComponent extends PaymentConcardisComponent {}
