import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { BasketView } from 'ish-core/models/basket/basket.model';

@Component({
  selector: 'camfil-camfill-checkout-header',
  templateUrl: './camfill-checkout-header.component.html',
  styleUrls: ['./camfill-checkout-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfillCheckoutHeaderComponent {
  @Input() basket: BasketView;
}
