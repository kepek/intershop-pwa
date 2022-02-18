import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Order } from 'camfil-pwa/models/order/order.model';

import { Basket } from 'ish-core/models/basket/basket.model';

@Component({
  selector: 'ish-checkout-receipt',
  templateUrl: './checkout-receipt.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutReceiptComponent {
  @Input() order: Order | Basket;
}
