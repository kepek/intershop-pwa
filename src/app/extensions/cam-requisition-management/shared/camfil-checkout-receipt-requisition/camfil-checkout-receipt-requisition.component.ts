import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Basket } from 'ish-core/models/basket/basket.model';
import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';

@GenerateLazyComponent()
@Component({
  selector: 'camfil-checkout-receipt-requisition',
  templateUrl: './camfil-checkout-receipt-requisition.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilCheckoutReceiptRequisitionComponent {
  @Input() basket: Basket;

  constructor() {}
}
