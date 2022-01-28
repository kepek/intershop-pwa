import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { BucketTotal } from 'ish-core/models/bucket-total/bucket-total.model';

@Component({
  selector: 'camfil-checkout-bucket-summary',
  templateUrl: './camfil-checkout-bucket-summary.component.html',
  styleUrls: ['./camfil-checkout-bucket-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// tslint:disable-next-line:component-creation-test
export class CamfilCheckoutBucketSummaryComponent {
  @Input() totals: BucketTotal;
  @Input() cssClass: string;
}
