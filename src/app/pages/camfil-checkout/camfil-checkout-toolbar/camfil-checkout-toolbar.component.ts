import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Bucket } from 'ish-core/models/basket/bucket.model';

@Component({
  selector: 'camfil-checkout-toolbar',
  templateUrl: './camfil-checkout-toolbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilCheckoutToolbarComponent {
  @Input() buckets: Bucket[];
  @Input() basketId: string;
}
