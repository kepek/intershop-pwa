import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Order } from 'camfil-pwa/models/order/order.model';

import { Basket } from 'ish-core/models/basket/basket.model';
import { Bucket } from 'ish-core/models/bucket/bucket.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';

@Component({
  selector: 'camfil-checkout-receipt',
  templateUrl: './camfil-checkout-receipt.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./camfil-checkout-receipt.component.scss'],
})
export class CamfilCheckoutReceiptComponent {
  @Input() order: Basket | Order;
  @Input() buckets: Bucket[];
  @Input() basketError: HttpError;
}
