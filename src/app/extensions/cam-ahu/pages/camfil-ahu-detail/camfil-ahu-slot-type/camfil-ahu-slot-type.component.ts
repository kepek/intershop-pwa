import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { UnitAHUAirSlotType } from '../../../models/unit/unit.model';
import { CamAhuAbstractComponent } from '../../camfil-ahu-abstract/camfil-ahu-abstract-page.component';

@Component({
  selector: 'camfil-ahu-slot-type',
  templateUrl: './camfil-ahu-slot-type.component.html',
  styleUrls: ['./camfil-ahu-slot-type.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// tslint:disable-next-line:component-creation-test
export class CamfilAhuSlotTypeComponent extends CamAhuAbstractComponent {
  /**
   * The product with the image information.
   */
  @Input() unitAHUAirSlotType: UnitAHUAirSlotType;
}
