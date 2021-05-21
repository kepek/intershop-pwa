import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { UnitAHUAirSlotType } from '../../../models/unit/unit.model';

@Component({
  selector: 'camfil-ahu-slot-type',
  templateUrl: './camfil-ahu-slot-type.component.html',
  styleUrls: ['./camfil-ahu-slot-type.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// tslint:disable-next-line:component-creation-test
export class CamfilAhuSlotTypeComponent {
  /**
   * The product with the image information.
   */
  @Input() unitAHUAirSlotType: UnitAHUAirSlotType;
}
