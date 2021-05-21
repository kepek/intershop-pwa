import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Unit, UnitAHUBasket, UnitAHUBasketSummary } from '../../../models/unit/unit.model';
import { CamAhuAbstractComponent } from '../../camfil-ahu-abstract/camfil-ahu-abstract-page.component';

@Component({
  selector: 'camfil-ahu-cart',
  templateUrl: './camfil-ahu-cart.component.html',
  styleUrls: ['./camfil-ahu-cart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// tslint:disable-next-line:component-creation-test
export class CamfilAhuCartComponent extends CamAhuAbstractComponent {
  /**
   * The product with the image information.
   */
  @Input() unit: Unit;
  @Input() basket: UnitAHUBasket[];
  @Input() summary: UnitAHUBasketSummary;
  @Input() isConfirmed: boolean;
}
