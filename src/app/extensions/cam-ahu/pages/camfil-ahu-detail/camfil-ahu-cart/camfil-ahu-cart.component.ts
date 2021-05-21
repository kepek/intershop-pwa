import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { UnitAHUBasket, UnitAHUBasketSummary } from '../../../models/unit/unit.model';

@Component({
  selector: 'camfil-ahu-cart',
  templateUrl: './camfil-ahu-cart.component.html',
  styleUrls: ['./camfil-ahu-cart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// tslint:disable-next-line:component-creation-test
export class CamfilAhuCartComponent {
  /**
   * The product with the image information.
   */
  @Input() basket: UnitAHUBasket[];
  @Input() summary: UnitAHUBasketSummary;
  @Input() isConfirmed: boolean;
}
