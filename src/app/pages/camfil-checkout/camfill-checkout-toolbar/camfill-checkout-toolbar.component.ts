import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Bucket } from 'ish-core/models/basket/bucket.model';

@Component({
  selector: 'camfil-camfill-checkout-toolbar',
  templateUrl: './camfill-checkout-toolbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfillCheckoutToolbarComponent {
  @Input() buckets: Bucket[];
}
