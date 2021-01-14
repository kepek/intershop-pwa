import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { BasketView } from 'ish-core/models/basket/basket.model';
import { Bucket } from 'ish-core/models/basket/bucket.model';

@Component({
  selector: 'camfil-checkout-header',
  templateUrl: './camfil-checkout-header.component.html',
  styleUrls: ['./camfil-checkout-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilCheckoutHeaderComponent {
  @Input() basket: BasketView;
  @Input() buckets: Bucket[];

  totalProductQuantity() {
    return this.buckets.reduce((a, b) => a + b.lineItems.reduce((c, d) => c + d.quantity.value, 0), 0);
  }
}
