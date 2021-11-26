import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Bucket } from 'ish-core/models/bucket/bucket.model';

@Component({
  selector: 'camfil-checkout-toolbar',
  templateUrl: './camfil-checkout-toolbar.component.html',
  styleUrls: ['./camfil-checkout-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilCheckoutToolbarComponent {
  @Input() buckets: Bucket[];
  @Input() basketId: string;
  @Input() shippingMethodId: string;
  @Input() isGuestCheckout = false;
}
